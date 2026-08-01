package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"time"

	"github.com/gorilla/websocket"
	"golang.org/x/crypto/ssh"
)

// WsMsg represents the JSON structure for WebSocket messages
type WsMsg struct {
	Type     string `json:"type"`
	Command  string `json:"command,omitempty"` // e.g. "ssh ubuntu@100.109.15.105"
	Host     string `json:"host,omitempty"`
	User     string `json:"user,omitempty"`
	Password string `json:"password,omitempty"`
	Data     string `json:"data,omitempty"`
	Cols     int    `json:"cols,omitempty"`
	Rows     int    `json:"rows,omitempty"`
	Message  string `json:"message,omitempty"` // For errors
}

func handleSSHConnection(conn *websocket.Conn) {
	log.Println("SSH handler started, waiting for connect message...")
	var msg WsMsg

	// Wait for the initial "connect" message
	err := conn.ReadJSON(&msg)
	if err != nil {
		log.Println("Error reading connect message:", err)
		return
	}

	if msg.Type != "connect" {
		conn.WriteJSON(WsMsg{Type: "error", Message: "Expected 'connect' message type"})
		return
	}

	host := msg.Host
	user := msg.User

	// If a command string is provided, e.g., "ssh ubuntu@100.109.15.105"
	if msg.Command != "" {
		// Simple parser for "ssh user@host"
		var parsedHost string
		n, _ := fmt.Sscanf(msg.Command, "ssh %s", &parsedHost)
		if n == 1 {
			// Check if it has user@
			for i, c := range parsedHost {
				if c == '@' {
					user = parsedHost[:i]
					host = parsedHost[i+1:]
					break
				}
			}
			// If no '@', assume the whole thing is the host
			if host == "" && user == "" {
				host = parsedHost
			}
		}
	}

	if host == "" {
		conn.WriteJSON(WsMsg{Type: "error", Message: "Host is required (either in 'host' or 'command' field)"})
		return
	}

	// Default port to 22 if not specified
	if !containsPort(host) {
		host = host + ":22"
	}

	user := msg.User
	if user == "" {
		user = "ubuntu" // Default based on user's instruction
	}

	password := msg.Password

	// If no password provided, prompt interactively
	if password == "" {
		conn.WriteJSON(WsMsg{Type: "output", Data: fmt.Sprintf("%s@%s's password: ", user, host)})
		
		// Wait for password input
		var passMsg WsMsg
		err := conn.ReadJSON(&passMsg)
		if err != nil {
			log.Println("Error reading password:", err)
			return
		}
		
		// Typically from terminal, password comes as "input" type with \r at the end, 
		// but we'll accept it from Data field as well
		if passMsg.Type == "input" {
			// Remove trailing newline/return from terminal input
			password = passMsg.Data
			if len(password) > 0 && (password[len(password)-1] == '\r' || password[len(password)-1] == '\n') {
				password = password[:len(password)-1]
			}
			if len(password) > 0 && (password[len(password)-1] == '\r' || password[len(password)-1] == '\n') {
				password = password[:len(password)-1]
			}
		} else if passMsg.Password != "" {
			password = passMsg.Password
		} else {
			password = passMsg.Data
		}
		
		conn.WriteJSON(WsMsg{Type: "output", Data: "\r\n"}) // Send newline after they type password
	}

	// Set up SSH client configuration
	config := &ssh.ClientConfig{
		User: user,
		Auth: []ssh.AuthMethod{
			ssh.Password(password),
		},
		HostKeyCallback: ssh.InsecureIgnoreHostKey(), // Insecure for simplicity, in prod you should verify host keys
		Timeout:         10 * time.Second,
	}

	log.Printf("Connecting to SSH %s@%s...", user, host)
	sshClient, err := ssh.Dial("tcp", host, config)
	if err != nil {
		log.Printf("Failed to dial: %s", err)
		conn.WriteJSON(WsMsg{Type: "error", Message: fmt.Sprintf("Failed to connect: %v", err)})
		return
	}
	defer sshClient.Close()

	session, err := sshClient.NewSession()
	if err != nil {
		log.Printf("Failed to create session: %s", err)
		conn.WriteJSON(WsMsg{Type: "error", Message: fmt.Sprintf("Failed to create session: %v", err)})
		return
	}
	defer session.Close()

	// Request pseudo terminal
	modes := ssh.TerminalModes{
		ssh.ECHO:          1,     // enable echoing
		ssh.TTY_OP_ISPEED: 14400, // input speed = 14.4kbaud
		ssh.TTY_OP_OSPEED: 14400, // output speed = 14.4kbaud
	}
	if err := session.RequestPty("xterm-256color", 40, 80, modes); err != nil {
		log.Printf("request for pseudo terminal failed: %s", err)
		conn.WriteJSON(WsMsg{Type: "error", Message: "Failed to request PTY"})
		return
	}

	stdin, err := session.StdinPipe()
	if err != nil {
		log.Printf("Unable to setup stdin for session: %v", err)
		return
	}

	stdout, err := session.StdoutPipe()
	if err != nil {
		log.Printf("Unable to setup stdout for session: %v", err)
		return
	}

	stderr, err := session.StderrPipe()
	if err != nil {
		log.Printf("Unable to setup stderr for session: %v", err)
		return
	}

	// Start shell
	if err := session.Shell(); err != nil {
		log.Printf("failed to start shell: %s", err)
		conn.WriteJSON(WsMsg{Type: "error", Message: "Failed to start shell"})
		return
	}

	// Notify frontend that connection is successful
	conn.WriteJSON(WsMsg{Type: "output", Data: "\r\n--- Connected to " + host + " ---\r\n"})

	// Setup channel for window resize
	resizeChan := make(chan struct {
		Cols int
		Rows int
	}, 10)

	// Goroutine for handling resize events
	go func() {
		for size := range resizeChan {
			session.WindowChange(size.Rows, size.Cols)
		}
	}()

	// Read from SSH stdout and write to WebSocket
	go func() {
		buf := make([]byte, 4096)
		for {
			n, err := stdout.Read(buf)
			if err != nil {
				if err != io.EOF {
					log.Printf("stdout read error: %v", err)
				}
				break
			}
			conn.WriteJSON(WsMsg{Type: "output", Data: string(buf[:n])})
		}
	}()

	// Read from SSH stderr and write to WebSocket
	go func() {
		buf := make([]byte, 4096)
		for {
			n, err := stderr.Read(buf)
			if err != nil {
				if err != io.EOF {
					log.Printf("stderr read error: %v", err)
				}
				break
			}
			conn.WriteJSON(WsMsg{Type: "output", Data: string(buf[:n])})
		}
	}()

	// Read from WebSocket and write to SSH stdin
	go func() {
		for {
			var wsMsg WsMsg
			err := conn.ReadJSON(&wsMsg)
			if err != nil {
				if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
					log.Printf("WebSocket read error: %v", err)
				}
				session.Close()
				break
			}

			if wsMsg.Type == "input" {
				stdin.Write([]byte(wsMsg.Data))
			} else if wsMsg.Type == "resize" {
				resizeChan <- struct {
					Cols int
					Rows int
				}{Cols: wsMsg.Cols, Rows: wsMsg.Rows}
			}
		}
	}()

	// Wait for session to finish
	err = session.Wait()
	if err != nil {
		log.Printf("Session exited with error: %v", err)
	} else {
		log.Printf("Session exited cleanly.")
	}
	conn.WriteJSON(WsMsg{Type: "output", Data: "\r\n--- Disconnected ---\r\n"})
}

func containsPort(host string) bool {
	for i := len(host) - 1; i >= 0; i-- {
		if host[i] == ':' {
			return true
		}
	}
	return false
}
