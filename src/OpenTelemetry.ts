import * as NodeSdk from "@effect/opentelemetry/NodeSdk"
import * as Resource from "@effect/opentelemetry/Resource"
import * as Tracer from "@effect/opentelemetry/Tracer"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http"
import { Effect, Layer } from "effect"

const ResourceLive = Resource.layer({ serviceName: "cats-service" })

const NodeSdkLive = NodeSdk.layer(Effect.sync(() =>
  NodeSdk.config({
    traceExporter: new OTLPTraceExporter()
  })
))

export const TracingLive = Layer.provide(
  ResourceLive,
  Layer.merge(NodeSdkLive, Tracer.layer)
)
