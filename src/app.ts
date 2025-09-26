import fastifyCors from "@fastify/cors";
import Fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { userRoutes } from "./models/user/user-routes.js";

import cookie from "@fastify/cookie";
import jwt, { type Secret } from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import scalarApiReference from "@scalar/fastify-api-reference";
import { CORS_ORIGINS, isProd, JWT_SECRET, NODE_ENV } from "./env.js";
import { authRoutes } from "./models/auth/auth-routes.js";
import { lessonRoutes } from "./models/lesson/lesson-route.js";
import { moduleRoutes } from "./models/module/module-routes.js";
import { errorHandlerPlugin } from "./plugins/error-handler.js";

export function app() {
  const app = Fastify().withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.register(cookie);
  app.register(jwt, {
    secret: JWT_SECRET as Secret,
    cookie: { cookieName: "access_token", signed: false },
  });
  app.register(errorHandlerPlugin);

  if (NODE_ENV === "development") {
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

  app.register(fastifyCors, {
    origin: isProd ? CORS_ORIGINS ?? false : true,
    credentials: true,
  });
  app.register(userRoutes, { prefix: "/api/users" });
  app.register(authRoutes, { prefix: "/api" });
  app.register(moduleRoutes, { prefix: "/api/modules" });
  app.register(lessonRoutes, { prefix: "/api/lessons" });
  return app;
}
