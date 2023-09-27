import { Context, Effect, Layer, flow, pipe } from "effect"
import * as Schema from "@effect/schema/Schema"
import * as Http from "@effect/platform-node/HttpClient"
import * as ParseResult from "@effect/schema/ParseResult"

export type CatsClient = {
  get: () => Effect.Effect<never, Http.error.HttpClientError | ParseResult.ParseError, Cat>
}

export const CatsClient = Context.Tag<CatsClient>("@app/cats")

class Cat extends Schema.Class<Cat>()({
  tags: Schema.array(Schema.string),
  createdAt: Schema.string,
  mimetype: Schema.string,
  url: Schema.string,
}) { }

const decodeCat = Http.response.schemaBodyJson(Cat)

const makeCataasClient = Effect.map(
  Http.client.Client,
  flow(
    Http.client.filterStatusOk,
    Http.client.mapRequest(Http.request.prependUrl("https://cataas.com")),
  )
)

const makeCatsClient = Effect.gen(function*(_) {
  yield* _(Effect.logDebug("Instantiating CatsClient"))
  const defaultHttpClient = yield* _(makeCataasClient)

  const get = () => {
    const request = pipe(
      Http.request.get("/cat"),
      Http.request.setUrlParam("json", "true"),
    )

    return Effect.logDebug(`Making cat request with ${JSON.stringify(request.urlParams)}`)
      .pipe(
        Effect.flatMap(_ => defaultHttpClient(request)),
        Effect.tap(r => Effect.logDebug(`Got response status ${r.status}`)),
        Effect.flatMap(decodeCat),
        Effect.tap(c => Effect.logDebug(`Got a ${c.tags.join(" and ")} kitty`)),
        Effect.withSpan("CatsClient.get")
      )
  }

  return CatsClient.of({ get })
})

export const CatsClientLive = pipe(
  Layer.effect(CatsClient, makeCatsClient),
  Layer.use(Http.client.layer)
)
