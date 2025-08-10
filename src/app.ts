import fastifyCors from "@fastify/cors";
import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { userRoutes } from "./models/user/user-route.js";

export function app() {
  const app = Fastify().withTypeProvider<ZodTypeProvider>();
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.register(fastifyCors, { origin: true });

  app.register(userRoutes, { prefix: "api/users" });

  return app;
}
