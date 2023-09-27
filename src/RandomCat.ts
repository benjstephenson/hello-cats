import { Context, Effect, Layer, pipe } from "effect";
import * as B from "@effect/data/Brand"
import { CatsClient } from "./CatsClient";

export type CatResource = string & B.Brand<"CatResource">
const CatResource = B.nominal<CatResource>()

export class CatError {
  readonly _tag = "CatError"
  readonly msg: string

  constructor(reason: string) { this.msg = `Couldn't get a cat, because an ${reason} error occured` }
}

export type RandomCatService = {
  randomCat: () => Effect.Effect<never, CatError, CatResource>
}

export const RandomCatService = Context.Tag<RandomCatService>("@app/RandomCatService")

export const makeRandomCatService = Effect.gen(function*(_) {
  const catClient = yield* _(CatsClient)

  yield* _(Effect.logDebug("Instantiating RandomCatService"))

  return RandomCatService.of({
    randomCat: () => pipe(
      catClient.get(),
      Effect.map(c => CatResource(c.base + "/" + c.url)),
      Effect.mapError(e => new CatError(e._tag))
    )
  })
})

export const RandomCatServiceLive = Layer.effect(RandomCatService, makeRandomCatService)
