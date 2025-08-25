import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

export class AppError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: unknown;
  constructor(params: {
    code: string;
    status: number;
    message: string;
    details?: unknown;
  }) {
    super(params.message);
    this.code = params.code;
    this.status = params.status;
    this.details = params.details;
  }
}

export const errorHandlerPlugin: FastifyPluginAsync = fp(async (app) => {
  app.setErrorHandler((err, req, reply) => {
    console.log(err);
    if (err instanceof AppError) {
      return reply.status(err.status).send({
        error: {
          code: err.code,
          message: err.message,
          details: err.details ?? null,
          traceId: req.id,
        },
      });
    }

    if (err?.code === "FST_ERR_VALIDATION") {
      return reply.status(400).send({
        error: {
          code: err.code,
          message: err.message,
          details: err.validation?.map((v) => ({
            code: v.keyword,
            message: v.message,
            context: err.validationContext,
          })),
          traceId: req.id,
        },
      });
    }
    return reply.status(500).send({
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error.",
        details: null,
        traceId: req.id,
      },
    });
  });
});
