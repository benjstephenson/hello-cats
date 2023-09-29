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
const NodeContext = __importStar(require("@effect/platform-node/NodeContext"));
const Runtime_1 = require("@effect/platform-node/Runtime");
const effect_1 = require("effect");
const CatsClient_1 = require("./CatsClient");
const RandomCat_1 = require("./RandomCat");
const OpenTel = __importStar(require("./OpenTelemetry"));
const server_1 = require("./server");
const LiveApplication = (0, effect_1.pipe)(
//Layer.scopedDiscard(Server.Routes),
//Layer.use(Server.DevServer),
server_1.FastifyAppLive, effect_1.Layer.use(RandomCat_1.RandomCatServiceLive), effect_1.Layer.use(CatsClient_1.CatsClientLive), effect_1.Layer.use(NodeContext.layer), effect_1.Layer.use(OpenTel.TracingLive));
(0, effect_1.pipe)(effect_1.Layer.launch(LiveApplication), effect_1.Effect.tapErrorCause(effect_1.Effect.logError), effect_1.Logger.withMinimumLogLevel(effect_1.LogLevel.Debug), Runtime_1.runMain);
