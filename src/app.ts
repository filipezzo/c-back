import fastifyCors from "@fastify/cors";
import Fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { userRoutes } from "./models/user/user-routes.js";

import fastifySwagger from "@fastify/swagger";
import scalarApiReference from "@scalar/fastify-api-reference";

export function app() {
  const app = Fastify().withTypeProvider<ZodTypeProvider>();

  if (process.env.NODE_ENV === "development") {
    app.register(fastifySwagger, {
      openapi: {
        info: {
          title: "Plataforma sobre C",
          version: "1.0.0",
        },
      },
      transform: jsonSchemaTransform,
    });

    app.register(scalarApiReference, {
      routePrefix: "/docs",
    });
  }
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.register(fastifyCors, { origin: true });

  app.register(userRoutes, { prefix: "api/users" });

  return app;
}
