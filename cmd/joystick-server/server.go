// Copyright 2015 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"flag"
	"html/template"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var serverAddr = flag.String("serverAddr", "localhost:8080", "http service address")

var upgrader = websocket.Upgrader{} // use default options

// echo is a simple HTTP handler function which upgrades the HTTP server connection to the WebSocket protocol
func echo(w http.ResponseWriter, r *http.Request) {

	// Set the CheckOrigin function to allow requests from the client
	upgrader.CheckOrigin = func(r *http.Request) bool {
		return true
	}

	// Upgrade the HTTP server connection to the WebSocket protocol
	conn, err := upgrader.Upgrade(w, r, nil)

	// Check if there was an error during the upgrade
	if err != nil {
		log.Print("upgrade:", err)
		return
	}

	// Close the connection when the function returns
	defer conn.Close()

	// Infinite loop to read messages from the client and write them back
	for {
		// Read a message from the client
		mt, message, err := conn.ReadMessage()

		// Check if there was an error while reading the message
		if err != nil {
			log.Println("read:", err)
			break
		}

		// Log the message to the console
		log.Printf("recv: %s", message)

		// Write the message back to the client
		err = conn.WriteMessage(mt, message)
		if err != nil {
			log.Println("write:", err)
			break
		}
	}
}

// home is a simple HTTP handler function which writes a message to the client
func home(w http.ResponseWriter, r *http.Request) {
	homeTemplate.Execute(w, "ws://"+r.Host+"/echo")
}

func main() {
	flag.Parse()
	log.SetFlags(0)

	http.HandleFunc("/echo", echo)
	http.HandleFunc("/", home)
	log.Printf("connecting to %s", *serverAddr)
	log.Fatal(http.ListenAndServe(*serverAddr, nil))
}

var homeTemplate = template.Must(template.ParseFiles("./cmd/joystick-server/server-template.html"))
