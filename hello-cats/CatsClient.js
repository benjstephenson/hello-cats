"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatsClientLive = exports.CatsClient = void 0;
const effect_1 = require("effect");
const Schema = __importStar(require("@effect/schema/Schema"));
const Http = __importStar(require("@effect/platform-node/HttpClient"));
exports.CatsClient = effect_1.Context.Tag("@app/cats");
class Cat extends Schema.Class()({
    tags: Schema.array(Schema.string),
    createdAt: Schema.string,
    mimetype: Schema.string,
    url: Schema.string,
}) {
}
const decodeCat = Http.response.schemaBodyJson(Cat);
const makeCataasClient = effect_1.Effect.map(Http.client.Client, (0, effect_1.flow)(Http.client.filterStatusOk, Http.client.mapRequest(Http.request.prependUrl("https://cataas.com"))));
const makeCatsClient = effect_1.Effect.gen(function* (_) {
    yield* _(effect_1.Effect.logDebug("Instantiating CatsClient"));
    const defaultHttpClient = yield* _(makeCataasClient);
    const get = () => {
        const request = (0, effect_1.pipe)(Http.request.get("/cat"), Http.request.setUrlParam("json", "true"));
        return effect_1.Effect.logDebug(`Making cat request with ${JSON.stringify(request.urlParams)}`)
            .pipe(effect_1.Effect.flatMap(_ => defaultHttpClient(request)), effect_1.Effect.tap(r => effect_1.Effect.logDebug(`Got response status ${r.status}`)), effect_1.Effect.flatMap(decodeCat), effect_1.Effect.tap(c => effect_1.Effect.logDebug(`Got a ${c.tags.join(" and ")} kitty`)), effect_1.Effect.withSpan("CatsClient.get"));
    };
    return exports.CatsClient.of({ get });
});
exports.CatsClientLive = (0, effect_1.pipe)(effect_1.Layer.effect(exports.CatsClient, makeCatsClient), effect_1.Layer.use(Http.client.layer));
