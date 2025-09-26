import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { handleGetLesson } from "./lesson-controller.js";
import { lessonResponseSchema } from "./lesson-schema.js";

export async function lessonRoutes(app: FastifyInstance) {
  app.get(
    "/:id",
    {
      schema: {
        tags: ["lessons"],
        summary: "Obter lição",
        params: z.object({ id: z.uuid() }),
        response: { 200: lessonResponseSchema },
      },
    },
    handleGetLesson
  );
}
