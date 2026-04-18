SHELL := /bin/zsh

MVN ?= mvn
JAVA21_HOME := $(shell /usr/libexec/java_home -v 21 2>/dev/null)
MVN_JAVA21 = JAVA_HOME="$(JAVA21_HOME)" PATH="$(JAVA21_HOME)/bin:$$PATH" $(MVN)

.PHONY: help install run-backend run-frontend run stop check-java21

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

stop:
	pkill -f "spring-boot:run" || true
	pkill -f "ng serve" || true