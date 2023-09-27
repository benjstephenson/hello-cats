import * as Http from "@effect/platform-node/HttpServer"
import { Effect, pipe } from "effect"
import { createServer } from "node:http"
import * as CatRoutes from "./CatRoutes"

export const DevServer = Http.server.layer(() => createServer(), { port: 3030 })

export const Routes = Effect.gen(function*(_) {

  yield* _(Effect.logInfo("🚀 Starting HTTP server..."))

  const routes = pipe(
    Http.router.empty,
    Http.router.mount("/cats", CatRoutes.router),

    Effect.catchTags({
      RouteNotFound: () => Effect.succeed(Http.response.empty({ status: 404 }))
    }),


    Effect.catchAllCause(cause =>
      Effect.as(
        Effect.logError("Unhandled HTTP error: ", cause),
        Http.response.empty({ status: 500 })
      )
    ),


    Http.server.serve(Http.middleware.logger),
  )

  yield* _(Effect.logInfo("👌🏻...ready!"))

  return yield* _(routes)
})
