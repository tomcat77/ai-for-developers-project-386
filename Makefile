SHELL := /bin/zsh

MVN ?= mvn
JAVA21_HOME := $(shell /usr/libexec/java_home -v 21 2>/dev/null)
MVN_JAVA21 = JAVA_HOME="$(JAVA21_HOME)" PATH="$(JAVA21_HOME)/bin:$$PATH" $(MVN)

.PHONY: help install run-backend run-frontend run stop check-java21 docker-build docker-up docker-down docker-logs test-e2e test-e2e-ui test-e2e-report

help: ## Show available targets
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make <target>\n\nTargets:\n"} /^[a-zA-Z0-9_.-]+:.*##/ {printf "  %-14s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

check-java21: ## Validate Java 21 is available
	@test -n "$(JAVA21_HOME)" || (echo "Java 21 is not installed or not found by /usr/libexec/java_home -v 21" && exit 1)

install: ## Install frontend dependencies
	source $(HOME)/.nvm/nvm.sh && nvm use v20.19.1 && npm install

run-frontend: ## Run frontend dev server
	source $(HOME)/.nvm/nvm.sh && nvm use v20.19.1 && npm run start --prefix frontend

run-backend: check-java21 ## Run backend Spring Boot app
	$(MVN_JAVA21) clean spring-boot:run -f backend/pom.xml

run: check-java21
	$(MVN_JAVA21) clean spring-boot:run -f backend/pom.xml & \
	source $(HOME)/.nvm/nvm.sh && nvm use v20.19.1 && npm run start --prefix frontend & \
	wait

stop: ## Stop local backend and frontend processes
	pkill -f "spring-boot:run" || true
	pkill -f "ng serve" || true

docker-build: ## Build united Docker image for backend and frontend
	docker build -t calls-calendar:latest .

docker-start: ## Start Docker Compose services (detached)
	docker run -d --name calls-calendar-test -p 80:80 -e PORT=80 calls-calendar:latest

docker-stop: ## Stop and remove Docker Compose services
	docker rm -f calls-calendar-test

docker-logs: ## View logs from Docker Compose services
	docker logs -f calls-calendar-test

test-e2e: ## Run Playwright E2E tests
	npx playwright test

test-e2e-ui: ## Run Playwright E2E tests with UI mode
	npx playwright test --ui

test-e2e-report: ## Show Playwright test report
	npx playwright show-report