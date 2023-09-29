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
exports.router = void 0;
const effect_1 = require("effect");
const Http = __importStar(require("@effect/platform-node/HttpServer"));
const RandomCat_1 = require("./RandomCat");
exports.router = Http.router.empty.pipe(Http.router.get("/", effect_1.Effect.gen(function* (_) {
    const catService = yield* _(RandomCat_1.RandomCatService);
    return yield* _((0, effect_1.pipe)(catService.randomCat(), effect_1.Effect.matchEffect({
        onSuccess: cat => Http.response.json({ catResource: cat }, { status: 200, headers: { "Access-Control-Allow-Origin": "*" } }),
        onFailure: e => Http.response.json({ reason: e }, { status: 500 })
    })));
})));
