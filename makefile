.PHONY: build help

help:
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies
	yarn

prepare-env: ## Initialize the environment variable file for the demo
	@cp -n ./packages/demo-react-admin/.env.template ./packages/demo-react-admin/.env

build-ra-auth-google:
	@echo "Transpiling ra-auth-google files...";
	@cd ./packages/ra-auth-google && yarn build

build-demo-react-admin:
	@echo "Transpiling demo files...";
	@cd ./packages/demo-react-admin && yarn build

build: build-ra-auth-google build-demo-react-admin ## compile ES6 files to JS

start-demo: ## Start the demo
	@cd ./packages/demo-react-admin && yarn start

start-fake-api: ## Start the fake API
	@cd ./packages/demo-fake-api && yarn start

start: ## Start the demo
	@(trap 'kill 0' INT; ${MAKE} start-fake-api & ${MAKE} start-demo)

publish: ## Publish the package
	cd packages/ra-auth-google && npm publish