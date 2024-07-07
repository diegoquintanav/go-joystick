# About

A joystick service that sends commands to a websocket, written in go.

## Usage

```bash
$ go run app/server.go
connecting to localhost:8080
```

in another terminal

```bash
$ go run app/client.go
connecting to localhost:8081
```

Go to the client in the browser and move the joystick around. The server will receive the commands and print them to the console.

## License

MIT
