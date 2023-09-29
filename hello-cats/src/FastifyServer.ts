import { Context, Data, Effect, Layer, pipe } from "effect"
import Fastify from "fastify"
import { RandomCatService } from "./RandomCat"

class ExecutionError extends Data.TaggedClass("ExecError")<String>{ }

export const FastifyApp = Context.Tag<void>("@app/fastify")

const makeFastifyApp = Effect.gen(function*(_) {

  const catService = yield* _(RandomCatService)

  yield* _(Effect.logDebug("starting server..."))

  const fastify = Fastify({ logger: true })

  fastify.get("/cats", async (_, reply) =>
    reply.code(200).send({ foo: "BAZ" })
    // Effect.runPromise(
    //   pipe(
    //     catService.randomCat(),
    //     Effect.match({
    //       onSuccess: cat => reply.code(200).send({ someOtherFields: "hello world!", catResource: cat }),
    //       onFailure: e => reply.code(500).send({ reason: e.msg })
    //     }),
    //   ))
  )

  return yield* _(Effect.tryPromise({
    try: _ => fastify.listen({ port: 8000, host: "0.0.0.0" }),
    catch: err => new ExecutionError(String(err))
  }))
})

export const FastifyAppLive = Layer.effect(FastifyApp, makeFastifyApp)
