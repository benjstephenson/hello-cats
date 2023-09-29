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
exports.Routes = exports.DevServer = void 0;
const Http = __importStar(require("@effect/platform-node/HttpServer"));
const effect_1 = require("effect");
const node_http_1 = require("node:http");
const CatRoutes = __importStar(require("./CatRoutes"));
exports.DevServer = Http.server.layer(() => (0, node_http_1.createServer)(), { host: "0.0.0.0", port: 8000 });
exports.Routes = effect_1.Effect.gen(function* (_) {
    yield* _(effect_1.Effect.logInfo("🚀 Starting HTTP server..."));
    const routes = (0, effect_1.pipe)(Http.router.empty, Http.router.mount("/cats", CatRoutes.router), effect_1.Effect.catchTags({
        RouteNotFound: () => effect_1.Effect.succeed(Http.response.empty({ status: 404 }))
    }), effect_1.Effect.catchAllCause(cause => effect_1.Effect.as(effect_1.Effect.logError("Unhandled HTTP error: ", cause), Http.response.empty({ status: 500 }))), Http.server.serve(Http.middleware.logger));
    yield* _(effect_1.Effect.logInfo("👌🏻...ready!"));
    return yield* _(routes);
});
