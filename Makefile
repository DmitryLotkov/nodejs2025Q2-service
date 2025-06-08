# Makefile

APP_NAME=home_library
COMPOSE=docker-compose

.PHONY: build up down restart logs

build:
	$(COMPOSE) build

up:
	$(COMPOSE) up

down:
	$(COMPOSE) down -v

restart:
	$(MAKE) down
	$(MAKE) build
	$(MAKE) up

logs:
	$(COMPOSE) logs -f
