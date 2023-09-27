import { Context, Effect, Layer, pipe } from "effect"
import * as Http from "@effect/platform-node/HttpServer"
import { RandomCatService } from "./RandomCat"

export const router = Http.router.empty.pipe(
  Http.router.get(
    "/",
    Effect.gen(function*(_) {
      const catService = yield* _(RandomCatService)

      return yield* _(pipe(
        catService.randomCat(),
        Effect.matchEffect({
          onSuccess: cat => Http.response.json({ catResource: cat }, { status: 200 }),
          onFailure: e => Http.response.json({ reason: e }, { status: 500 })
        }),
      ))
    })
  )
)
