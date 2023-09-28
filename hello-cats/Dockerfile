###############################################
################ Build App ####################
###############################################
# Note if updating the version, update dev/docker-compose image as well
FROM node:18-alpine as builder

# install dependences
ENV NODE_ENV development
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN mkdir /build
WORKDIR /build
COPY . .

# build application
ENV NODE_ENV production
RUN \
  node --version; \
  pnpm --version; \
  pnpm run build; \
  pnpm run ci:install:prod 


###############################################
############## Create Image ###################
###############################################
# Note if updating the version, update dev/docker-compose image as well
FROM node:18-alpine

EXPOSE 9034

ARG VERSION
ARG GIT_SHA
ARG BUILD_DATE

ARG SERVICE_NAME="hello-cats-service"

LABEL "maintainer"="REI Team"

LABEL "org.opencontainers.image.created"=${BUILD_DATE} \
      "org.opencontainers.image.title"="Hello Cats Serivce" \
      "org.opencontainers.image.vendor"="EzyVet" \
      "org.opencontainers.image.version"=${VERSION} \
      "org.opencontainers.image.revision"=${GIT_SHA}

LABEL "com.datadoghq.tags.service"=${SERVICE_NAME} \
      "com.datadoghq.tags.version"=${VERSION}

# Setup app user and app entrypoint
COPY ./docker/entrypoint.sh /usr/local/bin/
RUN \
  chmod +x /usr/local/bin/entrypoint.sh; \
  mkdir /app; \
  addgroup -S app && adduser -S app -G app -h /app
WORKDIR /app
ENTRYPOINT ["entrypoint.sh"]
USER app


ENV NODE_ENV="production" \
    DD_SERVICE=${SERVICE_NAME} \
    DD_VERSION=${VERSION}

# Copy application
COPY --chown=app:app ./package.json /app
COPY --chown=app:app ./pnpm-lock.yaml /app
COPY --chown=app:app --from=builder /build/dist /app
COPY --chown=app:app --from=builder /build/node_modules /app/node_modules
