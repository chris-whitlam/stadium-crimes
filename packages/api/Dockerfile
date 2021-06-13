FROM node:14.15.5-alpine3.13

ARG UID=1000
ARG GID=1000

RUN mkdir /app && chown -R $UID:$GID /app
WORKDIR /app

USER $UID

# Ensure linux named volumes don't create volumes owned as root
RUN mkdir -p $HOME/.cache/yarn && chown -R $UID:$GID $HOME/.cache/yarn

RUN mkdir -p /app/node_modules && chown -R $UID:$GID /app/node_modules
RUN mkdir -p /app/packages/api/node_modules && chown -R $UID:$GID /app/packages/api/node_modules