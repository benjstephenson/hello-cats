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
exports.RandomCatServiceLive = exports.makeRandomCatService = exports.RandomCatService = exports.CatError = void 0;
const effect_1 = require("effect");
const B = __importStar(require("@effect/data/Brand"));
const CatsClient_1 = require("./CatsClient");
const CatResource = B.nominal();
class CatError {
    _tag = "CatError";
    msg;
    constructor(reason) { this.msg = `Couldn't get a cat, because an ${reason} error occured`; }
}
exports.CatError = CatError;
exports.RandomCatService = effect_1.Context.Tag("@app/RandomCatService");
exports.makeRandomCatService = effect_1.Effect.gen(function* (_) {
    const catClient = yield* _(CatsClient_1.CatsClient);
    yield* _(effect_1.Effect.logDebug("Instantiating RandomCatService"));
    return exports.RandomCatService.of({
        randomCat: () => (0, effect_1.pipe)(catClient.get(), effect_1.Effect.map(c => CatResource(c.url)), effect_1.Effect.mapError(e => new CatError(e._tag)))
    });
});
exports.RandomCatServiceLive = effect_1.Layer.effect(exports.RandomCatService, exports.makeRandomCatService);
