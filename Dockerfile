FROM node:18-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build

FROM base AS hello-cats-service
COPY --from=prod-deps /app/hello-cats/node_modules/ /app/hello-cats/node_modules
COPY --from=build /app/hello-cats/dist /app/hello-cats/dist
WORKDIR /app/hello-cats
EXPOSE 8000
CMD [ "pnpm", "start" ]

# FROM base AS hello-cats-mfe
# COPY --from=prod-deps /app/hello-cats-mfe/node_modules/ /app/hello-cats-mfe/node_modules
# COPY --from=build /app/hello-cats-mfe/dist /app/hello-cats-mfe/dist
# WORKDIR /app/hello-cats-mfe
# EXPOSE 8001
# CMD [ "pnpm", "start" ]
