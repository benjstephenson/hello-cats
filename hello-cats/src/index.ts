import * as NodeContext from "@effect/platform-node/NodeContext"
import { runMain } from "@effect/platform-node/Runtime"
import { Effect, Layer, LogLevel, Logger, pipe } from "effect"
import { CatsClientLive } from "./CatsClient"
import { RandomCatServiceLive } from "./RandomCat"
import * as OpenTel from "./OpenTelemetry"
import * as Server from "./HttpServer"

const LiveApplication = pipe(
  Layer.scopedDiscard(Server.Routes),
  Layer.use(Server.DevServer),
  Layer.use(RandomCatServiceLive),
  Layer.use(CatsClientLive),
  Layer.use(NodeContext.layer),
  Layer.use(OpenTel.TracingLive)
)

pipe(
  Layer.launch(LiveApplication),
  Effect.tapErrorCause(Effect.logError),
  Logger.withMinimumLogLevel(LogLevel.Debug),
  runMain
)
