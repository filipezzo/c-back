import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { handleGetModule, handleListModules } from "./module-controller.js";
import {
  moduleResponseSchema,
  moduleWithLessonsSchema,
} from "./module-schema.js";

export async function moduleRoutes(app: FastifyInstance) {
  app.get(
    "/",
    {
      schema: {
        tags: ["modules"],
        summary: "Lista módulos",
        response: { 200: z.array(moduleResponseSchema) },
      },
    },
    handleListModules
  );

  app.get(
    "/:id",
    {
      schema: {
        tags: ["modules"],
        summary: "Detalha módulo (com lições)",
        params: z.object({ id: z.uuid() }),
        response: { 200: moduleWithLessonsSchema },
      },
    },
    handleGetModule
  );
}
