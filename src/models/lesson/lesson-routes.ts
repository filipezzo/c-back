import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { authGuard } from "../auth/auth-guard.js";
import {
  handleCompleteLesson,
  handleGetLesson,
  handleGetQuiz,
  handleSubmitQuiz,
} from "./lesson-controller.js";
import {
  lessonResponseSchema,
  quizResponseSchema,
  quizResultSchema,
  quizSubmitSchema,
} from "./lesson-schema.js";

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

  app.get(
    "/:id/quiz",
    {
      schema: {
        tags: ["lessons"],
        summary: "Obter quiz da lição (sem gabarito)",
        params: z.object({ id: z.uuid() }),
        response: { 200: quizResponseSchema },
      },
    },
    handleGetQuiz
  );

  app.post(
    "/:id/quiz/submit",
    {
      preHandler: authGuard,
      schema: {
        tags: ["lessons"],
        summary: "Enviar respostas do quiz",
        params: z.object({ id: z.uuid() }),
        body: quizSubmitSchema,
        response: { 200: quizResultSchema },
      },
    },
    handleSubmitQuiz
  );

  app.post(
    "/:id/complete",
    {
      preHandler: authGuard,
      schema: {
        tags: ["lessons"],
        summary: "Marcar lição como concluída",
        params: z.object({ id: z.uuid() }),
        response: { 204: z.null() },
      },
    },
    handleCompleteLesson
  );
}
