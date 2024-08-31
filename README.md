# About

A joystick service that sends commands to a websocket, written in go.

![joystick-preview](assets/image.png)

## Usage

```bash
$ go run cmd/joystick-server/server.go
connecting to localhost:8080
```

in another terminal

```bash
$ go run cmd/joystick-client/client.go
connecting to localhost:8081
```

Go to the client in the browser and move the joystick around. The server will receive the commands and print them to the console.

The client has the following flags:

* `serverAddr`: Websocket or http service address of the server receiving websocket messages
* `serverEndpoint`: Endpoint of the server receiving websocket messages. By default it is `/echo`, the endpoint of the echo server in server.go
* `clientAddr`: Address of the http client
* `clientName`: Name of the user client used to send messages to the server

For example, to connect to the echo server in the server.go file, run the following command:

```bash
$ go run cmd/joystick-client/client.go  -serverAddr localhost:8080 -serverEndpoint /echo -clientAddr localhost:8081 -clientName ""
```

## Developing with [air](https://github.com/air-verse/air?tab=readme-ov-file)

In separate terminals run the following commands:

```bash
$ air -c .air.joystick-client.toml # runs the client in port 8091
```

```bash
$ air -c .air.joystick-server.toml # runs the server in port 8090
```

To connect to the sompics server, run the following command:

```bash
$ air -c .air.joystick-client-sompics.toml # runs the server in port 8091, and connects to sompics in port 9080
```

## License

MIT
