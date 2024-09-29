.DEFAULT_GOAL := help
.PHONY: help


help: ## Print this help
	@grep -E '^[0-9a-zA-Z_\-\.]+:.*?## .*$$' Makefile | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

air.client.launch.default: ## Launch client using air
	@air -c .air.joystick-client.toml

air.client.launch.sompics: ## Launch client adapted to sompics server
	@air -c .air.joystick-server.toml

air.server.launch.default: ## Launch server using air
	@air -c .air.joystick-client-sompics.toml

docker-compose.client.sompics.up: ## Launch client using docker-compose
	@docker compose -f docker-compose-sompics.yml up