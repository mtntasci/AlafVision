package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gorilla/websocket"
	"golang.org/x/crypto/ssh"
)

// Sadece resize için JSON kullanılıyor
type ResizeMsg struct {
	Type string `json:"type"`
	Cols int    `json:"cols"`
	Rows int    `json:"rows"`
}

// http.HandleFunc("/ws/ssh", sshHttpHandler) şeklinde main() içerisine eklenecek
func sshHttpHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Upgrade error:", err)
		return
	}

	ip := r.URL.Query().Get("ip")
	if ip == "" {
		conn.WriteMessage(websocket.TextMessage, []byte("\x1b[31mError: 'ip' query parameter is required.\x1b[0m\r\n"))
		conn.Close()
		return
	}

	handleSSHConnection(conn, ip)
}

func handleSSHConnection(conn *websocket.Conn, ip string) {
	defer conn.Close()

	user := "ubuntu"
	host := ip + ":22"

	// 1. Etkileşimli Şifre İsteme (Raw Xterm formatında)
	conn.WriteMessage(websocket.TextMessage, []byte(fmt.Sprintf("%s@%s's password: ", user, ip)))

	var password string
	for {
		msgType, msg, err := conn.ReadMessage()
		if err != nil {
			log.Println("Error reading password:", err)
			return
		}

		if msgType == websocket.TextMessage || msgType == websocket.BinaryMessage {
			strMsg := string(msg)

			// Şifre yazılırken olası resize mesajlarını atla
			if strings.HasPrefix(strMsg, `{"type":"resize"`) {
				continue
			}

			// Xterm.js Enter tuşuna basıldığında "\r" gönderir
			if strings.Contains(strMsg, "\r") {
				idx := strings.Index(strMsg, "\r")
				password += strMsg[:idx]
				conn.WriteMessage(websocket.TextMessage, []byte("\r\n")) // Şifre bittikten sonra alt satıra geç
				break
			} else {
				password += strMsg
				// SSH standartlarında şifre ekrana yazdırılmaz, bu nedenle echo (yankı) yapmıyoruz.
			}
		}
	}

	// 2. SSH Bağlantısını Başlat
	config := &ssh.ClientConfig{
		User: user,
		Auth: []ssh.AuthMethod{
			ssh.Password(password),
		},
		HostKeyCallback: ssh.InsecureIgnoreHostKey(),
		Timeout:         10 * time.Second,
	}

	conn.WriteMessage(websocket.TextMessage, []byte("\x1b[33mConnecting to SSH server...\x1b[0m\r\n"))

	sshClient, err := ssh.Dial("tcp", host, config)
	if err != nil {
		errMsg := fmt.Sprintf("\x1b[31mFailed to connect: %v\x1b[0m\r\n", err)
		conn.WriteMessage(websocket.TextMessage, []byte(errMsg))
		return
	}
	defer sshClient.Close()

	session, err := sshClient.NewSession()
	if err != nil {
		conn.WriteMessage(websocket.TextMessage, []byte(fmt.Sprintf("\x1b[31mFailed to create session: %v\x1b[0m\r\n", err)))
		return
	}
	defer session.Close()

	// PTY (Pseudo-Terminal) İsteği
	modes := ssh.TerminalModes{
		ssh.ECHO:          1,
		ssh.TTY_OP_ISPEED: 14400,
		ssh.TTY_OP_OSPEED: 14400,
	}
	if err := session.RequestPty("xterm-256color", 40, 80, modes); err != nil {
		conn.WriteMessage(websocket.TextMessage, []byte("\x1b[31mFailed to request PTY\x1b[0m\r\n"))
		return
	}

	stdin, _ := session.StdinPipe()
	stdout, _ := session.StdoutPipe()
	stderr, _ := session.StderrPipe()

	if err := session.Shell(); err != nil {
		conn.WriteMessage(websocket.TextMessage, []byte("\x1b[31mFailed to start shell\x1b[0m\r\n"))
		return
	}

	conn.WriteMessage(websocket.TextMessage, []byte(fmt.Sprintf("\x1b[32m--- Successfully Connected to %s ---\x1b[0m\r\n", host)))

	// 3. I/O Yönlendirmeleri

	// Stdout'u oku -> WebSocket'e (xterm.js) gönder
	go func() {
		buf := make([]byte, 4096)
		for {
			n, err := stdout.Read(buf)
			if err != nil {
				break
			}
			conn.WriteMessage(websocket.TextMessage, buf[:n])
		}
	}()

	// Stderr'i oku -> WebSocket'e gönder
	go func() {
		buf := make([]byte, 4096)
		for {
			n, err := stderr.Read(buf)
			if err != nil {
				break
			}
			conn.WriteMessage(websocket.TextMessage, buf[:n])
		}
	}()

	// WebSocket'ten (xterm.js) oku -> SSH Stdin'e gönder (Resize mesajlarını ayırt et)
	go func() {
		for {
			msgType, msg, err := conn.ReadMessage()
			if err != nil {
				session.Close()
				break
			}

			if msgType == websocket.TextMessage || msgType == websocket.BinaryMessage {
				strMsg := string(msg)
				
				// Eğer gelen veri JSON tabanlı bir resize komutuysa ayrıştır ve işle
				if strings.HasPrefix(strMsg, `{"type":"resize"`) {
					var resize ResizeMsg
					if err := json.Unmarshal(msg, &resize); err == nil {
						session.WindowChange(resize.Rows, resize.Cols)
					}
				} else {
					// Değilse, kullanıcının klavyeden bastığı ham tuşları SSH sunucusuna yaz
					stdin.Write(msg)
				}
			}
		}
	}()

	session.Wait()
	conn.WriteMessage(websocket.TextMessage, []byte("\r\n\x1b[31m--- Disconnected ---\x1b[0m\r\n"))
}
