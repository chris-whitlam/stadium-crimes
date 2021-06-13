export UID := 0
export GID := 0

ifeq ($(UNAME_S),Linux)
	export UID := $(shell id -u)
	export GID := $(shell id -g)
endif

export AND_DIGITAL_DIR := $(shell pwd)
export OPENSSL := docker run --rm -e HOME=/.ssl -v ${AND_DIGITAL_DIR}/.ssl:/.ssl -u ${UID}:${GID} frapsoft/openssl


# SSL Jobs

ssl-keys:
	mkdir -p .ssl/
	${OPENSSL} genrsa -out /.ssl/san.key 2048
	${OPENSSL} genrsa -des3 -passout pass:"and" -out /.ssl/ca.key 2048

ssl-root:
	${OPENSSL} req -x509 -new -nodes -key /.ssl/ca.key -sha256 -days 820 -out /.ssl/ca.crt -passin pass:"and" \
	  -subj "/C=GB/ST=West Yorkshire/L=Leeds/O=ANDDigital/OU=Engineering/CN=ANDDigital Root CA"

ssl-cert:
	${OPENSSL} req -new -key /.ssl/san.key -out /.ssl/san.csr \
	  -subj "/C=GB/ST=West Yorkshire/L=Leeds/O=ANDDigital/OU=Engineering/CN=*.and-digital.local"
	${OPENSSL} x509 -req -in /.ssl/san.csr \
	  -CA /.ssl/ca.crt -CAkey /.ssl/ca.key -CAcreateserial -CAserial /.ssl/ca.srl -passin pass:"and" \
	  -out /.ssl/san.crt -days 800 -sha256 -extfile /.ssl/san.ext

ssl-install:
	./.scripts/ssl.sh

# Setup Jobs

ssl: ssl-keys ssl-root ssl-cert ssl-install

dns:
	./.scripts/hosts.sh

install:
	docker-compose ${COMPOSE_FILES} run --rm api yarn

# Development Commands

logs:
	docker-compose ${COMPOSE_FILES} logs -f --tail 100

up:
	docker-compose ${COMPOSE_FILES} up -d

down:
	docker-compose ${COMPOSE_FILES} down

restart: down up

run-%:
	docker-compose ${COMPOSE_FILES} run --rm $* ${cmd}

shell-%:
	docker-compose ${COMPOSE_FILES} run --rm $* /bin/sh

build:
	docker-compose run --rm api yarn --cwd packages/api build

start:
	docker-compose run --rm api yarn --cwd packages/api start

dev:
	docker-compose run --rm api yarn --cwd packages/api dev

# Test Commands

lint:
	docker-compose run --rm api yarn lint

test:
	docker-compose run --rm api yarn test

