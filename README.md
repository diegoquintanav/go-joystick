# About

A joystick service that sends commands to a websocket, written in go.

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

## Developing with [air]((https://github.com/air-verse/air?tab=readme-ov-file))

In separate terminals run the following commands:

```bash
$ air -c .air.joystick-client.toml # runs the client in port 8091
```

```bash
$ air -c .air.joystick-server.toml # runs the server in port 8090
```

## License

MIT
