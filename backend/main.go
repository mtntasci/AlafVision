package main

/*
#cgo CXXFLAGS: -std=c++11
#cgo LDFLAGS: -lultimateALPR-SDK
#cgo pkg-config: opencv4
#include "alpr_wrapper.h"
#include "human_tracker.h"
#include <stdlib.h>
*/
import "C"

import (
	"context"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/websocket"
)

type contextKey string
const engineKey contextKey = "engine"

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins for this demo
	},
}

// Simple hardcoded token for demonstration as per requirement (No Ed25519)
const ValidBearerToken = "admin_token_123"

func authMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		token := r.URL.Query().Get("token")
		if token == "" {
			authHeader := r.Header.Get("Authorization")
			if strings.HasPrefix(authHeader, "Bearer ") {
				token = strings.TrimPrefix(authHeader, "Bearer ")
			}
		}

		var engine string
		// Yeni mimaride önek (prefix) üzerinden motor yönlendirmesi yapıyoruz
		if strings.HasPrefix(token, "vehicle_") {
			engine = "vehicle"
		} else if strings.HasPrefix(token, "humanCounter_") {
			engine = "human"
		} else {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), engineKey, engine)
		next(w, r.WithContext(ctx))
	}
}

func streamHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Upgrade error:", err)
		return
	}
	defer conn.Close()

	engine, _ := r.Context().Value(engineKey).(string)
	log.Printf("Client connected to /stream (Engine: %s)\n", engine)

	for {
		messageType, message, err := conn.ReadMessage()
		if err != nil {
			log.Println("Read error or client disconnected:", err)
			break
		}

		// Sadece binary (video karesi) mesajları işle
		if messageType == websocket.BinaryMessage {
			log.Printf("[%s] Frame received, size: %d bytes\n", engine, len(message))
			
			cData := C.CBytes(message)
			cSize := C.int(len(message))
			
			var cResult *C.char

			// Motora göre yönlendirme
			if engine == "vehicle" {
				log.Println("Sending frame to C++ ALPR...")
				cResult = C.AlprProcessFrame(cData, cSize)
			} else if engine == "human" {
				log.Println("Sending frame to C++ Human Tracker...")
				cResult = C.HumanTrackerProcessFrame(cData, cSize)
			}
			
			if cResult != nil {
				goResult := C.GoString(cResult)
				if engine == "vehicle" {
					log.Printf("C++ ALPR returned JSON: %s\n", goResult)
				} else if engine == "human" {
					log.Printf("C++ HumanTracker returned JSON: %s\n", goResult)
				}
				
				if engine == "vehicle" {
					C.AlprFreeResult(cResult)
				} else if engine == "human" {
					C.HumanTrackerFreeResult(cResult)
				}
				C.free(cData)

				err = conn.WriteMessage(websocket.TextMessage, []byte(goResult))
				if err != nil {
					log.Println("Write error:", err)
					break
				}
			} else {
				C.free(cData)
			}
		} else {
			log.Println("Received non-binary message, ignoring.")
		}
	}
}

func main() {
	log.Println("Initializing ALPR Engine...")
	initRes := C.AlprInit()
	if initRes != 0 {
		log.Println("Failed to initialize ALPR Engine. (Make sure Doubango SDK is installed)")
	} else {
		log.Println("ALPR Engine Initialized Successfully.")
	}

	htInitRes := C.HumanTrackerInit()
	if htInitRes != 0 {
		log.Println("Failed to initialize Human Tracker Engine.")
	} else {
		log.Println("Human Tracker Engine Initialized Successfully.")
	}

	http.HandleFunc("/stream", authMiddleware(streamHandler))

	port := "8080"
	log.Printf("Starting ALPR WebSocket server on :%s\n", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal("ListenAndServe error: ", err)
	}
}
