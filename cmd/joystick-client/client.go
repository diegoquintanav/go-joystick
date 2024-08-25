// Copyright 2015 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

//go:build ignore
// +build ignore

package main

import (
	"flag"
	"html/template"
	"log"
	"net/http"
	"net/url"
	"os"
	"os/signal"
	"time"

	"github.com/gorilla/websocket"
)

var serverAddr = flag.String("serverAddr", "localhost:8080", "http service address")

var clientAddr = flag.String("clientAddr", "localhost:8081", "http client address")

// home is a simple HTTP handler function which writes a message to the client
func home(w http.ResponseWriter, r *http.Request) {
	// Execute the homeTemplate with the WebSocket server address
	// Create a URL object to connect to the WebSocket server

	homeTemplate.Execute(w, "ws://"+*serverAddr+"/echo")
}

func sendTickMessages() {
	// Create a channel to listen for interrupt signals
	interrupt := make(chan os.Signal, 1)

	// Notify the interrupt channel when an interrupt signal is sent to the program
	signal.Notify(interrupt, os.Interrupt)

	// Create a URL object to connect to the WebSocket server
	u := url.URL{Scheme: "ws", Host: *serverAddr, Path: "/echo"}

	// Log the URL to the console
	log.Printf("connecting to %s", u.String())

	// Create a WebSocket connection to the server
	conn, _, err := websocket.DefaultDialer.Dial(u.String(), nil)

	if err != nil {
		log.Fatal("dial:", err)
	}

	// Close the connection when the function returns
	defer conn.Close()

	// Create a channel to listen for when the function returns
	done := make(chan struct{})

	// Create a goroutine to read messages from the server
	go func() {
		// Close the channel when the function returns
		defer close(done)

		for {
			_, message, err := conn.ReadMessage()
			if err != nil {
				log.Println("read:", err)
				return
			}
			log.Printf("recv: %s", message)
		}
	}()

	// Create a ticker to send messages to the server every second
	ticker := time.NewTicker(time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-done:
			return
		case t := <-ticker.C:
			// Write the current time to the server
			err := conn.WriteMessage(websocket.TextMessage, []byte(t.String()))

			if err != nil {
				log.Println("write:", err)
				return
			}

		case <-interrupt:

			log.Println("interrupt")

			// Cleanly close the connection by sending a close message and then
			// waiting (with timeout) for the server to close the connection.
			err := conn.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, "Closing connection from client"))

			if err != nil {
				log.Println("write close:", err)
				return
			}

			select {
			case <-done:
			case <-time.After(time.Second):
			}
			return
		}
	}
}

func main() {
	flag.Parse()
	log.SetFlags(0)

	http.HandleFunc("/", home)

	log.Printf("connecting to %s", *clientAddr)
	log.Fatal(http.ListenAndServe(*clientAddr, nil))

}

var homeTemplate = template.Must(template.ParseFiles("./app/client-template.html"))
