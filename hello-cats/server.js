"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FastifyAppLive = exports.FastifyApp = void 0;
const effect_1 = require("effect");
const fastify_1 = __importDefault(require("fastify"));
const RandomCat_1 = require("./RandomCat");
class ExecutionError extends effect_1.Data.TaggedClass("ExecError") {
}
exports.FastifyApp = effect_1.Context.Tag("@app/fastify");
const makeFastifyApp = effect_1.Effect.gen(function* (_) {
    const catService = yield* _(RandomCat_1.RandomCatService);
    yield* _(effect_1.Effect.logDebug("starting server..."));
    const fastify = (0, fastify_1.default)({ logger: true });
    fastify.get("/cats", async (_, reply) => effect_1.Effect.runPromise((0, effect_1.pipe)(catService.randomCat(), effect_1.Effect.match({
        onSuccess: cat => reply.code(200).send({ someOtherFields: "hello", catResource: cat }),
        onFailure: e => reply.code(500).send({ reason: e.msg })
    }))));
    return yield* _(effect_1.Effect.tryPromise({
        try: _ => fastify.listen({ port: 8000, host: "0.0.0.0" }),
        catch: err => new ExecutionError(String(err))
    }));
});
exports.FastifyAppLive = effect_1.Layer.effect(exports.FastifyApp, makeFastifyApp);
