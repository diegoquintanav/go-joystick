# Specifies a parent image
FROM golang:1.20.1-bullseye

# Creates an app directory to hold your app’s source code
WORKDIR /app

# Copies everything from your root directory into /app
COPY go.mod go.sum ./
COPY ./cmd/joystick-server /app/cmd/joystick-server

# Installs Go dependencies
RUN go mod download

# Builds your app with optional configuration
RUN go build -o /app/build/joystick-server/server /app/cmd/joystick-server

# Tells Docker which network port your container listens on
EXPOSE 8080

# Specifies the executable command that runs when the container starts
CMD [ "/app/build/joystick-server/server", "-serverAddr=0.0.0.0:8080"]