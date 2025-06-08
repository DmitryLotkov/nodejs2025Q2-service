
# Makefile for Home Library Service

.DEFAULT_GOAL := help

# Starts the development mode with hot-reloading
dev:
	docker compose -f docker-compose.yml -f docker-compose.override.yml up --build --watch

# Starts the production build
prod:
	docker compose -f docker-compose.yml up --build

# Stops and removes containers, networks, volumes, and images created by up
down:
	docker compose down -v

# Rebuild the containers
build:
	docker compose build

# Restart containers
restart:
	docker compose down -v && docker compose up --build

# Run tests
test:
	docker compose exec app npm run test

# Run auth tests
test-auth:
	docker compose exec app npm run test:auth

# Show this help message
help:
	@echo "Usage:"
	@echo "  make dev         Start in development mode with watch"
	@echo "  make prod        Start in production mode"
	@echo "  make down        Stop and remove containers"
	@echo "  make build       Rebuild containers"
	@echo "  make restart     Rebuild and restart containers"
	@echo "  make test        Run test suite without auth"
	@echo "  make test-auth   Run test suite with auth"
	@echo "  make help        Show this message"
