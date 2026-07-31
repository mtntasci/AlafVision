package main

/*
#cgo CXXFLAGS: -std=c++11
#cgo LDFLAGS: -lultimateALPR-SDK
#include "alpr_wrapper.h"
#include <stdlib.h>
*/
import "C"

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/websocket"
)

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

		if token != ValidBearerToken {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		next(w, r)
	}
}

func streamHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Upgrade error:", err)
		return
	}
	defer conn.Close()

	log.Println("Client connected to /stream")

	for {
		messageType, message, err := conn.ReadMessage()
		if err != nil {
			log.Println("Read error or client disconnected:", err)
			break
		}

		// Only process binary messages (video frames)
		if messageType == websocket.BinaryMessage {
			// Convert Go byte slice to C void pointer
			cData := C.CBytes(message)
			cSize := C.int(len(message))

			// Call C++ ALPR function
			cResult := C.AlprProcessFrame(cData, cSize)
			
			if cResult != nil {
				// Convert C string to Go string
				goResult := C.GoString(cResult)
				
				// Free the C string and data
				C.AlprFreeResult(cResult)
				C.free(cData)

				// Filter results by confidence (threshold = 70%)
				var parsedData map[string]interface{}
				if err := json.Unmarshal([]byte(goResult), &parsedData); err == nil {
					hasValidDetections := true
					
					// Check if it's the ultimateALPR 'plates' array format
					if platesRaw, ok := parsedData["plates"]; ok {
						if plates, ok := platesRaw.([]interface{}); ok {
							var filteredPlates []interface{}
							for _, pRaw := range plates {
								if p, ok := pRaw.(map[string]interface{}); ok {
									conf := 0.0
									if c, ok := p["confidence"].(float64); ok {
										conf = c
									}
									// Only keep plates with confidence >= 70
									if conf >= 70.0 {
										filteredPlates = append(filteredPlates, p)
									}
								}
							}
							
							parsedData["plates"] = filteredPlates
							// If all plates were filtered out, don't send anything
							if len(filteredPlates) == 0 {
								hasValidDetections = false
							}
						}
					} else {
						// Fallback: If it's a flat object mock
						if c, ok := parsedData["confidence"].(float64); ok {
							if c < 70.0 {
								hasValidDetections = false
							}
						}
					}
					
					if !hasValidDetections {
						continue // Skip sending this frame's result to frontend
					}
					
					// Re-marshal the filtered data
					if filteredBytes, err := json.Marshal(parsedData); err == nil {
						goResult = string(filteredBytes)
					}
				}

				// Send the JSON result back to the client
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
	// Init ALPR Engine (Call C function)
	initRes := C.AlprInit()
	if initRes != 0 {
		log.Println("Failed to initialize ALPR Engine. (Make sure Doubango SDK is installed)")
		// We continue anyway for boilerplate, but in production we might os.Exit(1)
	} else {
		log.Println("ALPR Engine Initialized Successfully.")
	}

	http.HandleFunc("/stream", authMiddleware(streamHandler))

	port := "8080"
	log.Printf("Starting ALPR WebSocket server on :%s\n", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal("ListenAndServe error: ", err)
	}
}
