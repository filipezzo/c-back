import type { FastifyReply, FastifyRequest } from "fastify";
import type { default as z } from "zod";
import { AppError } from "../../plugins/error-handler.js";
import type { lessonCreateSchema, quizSubmitSchema } from "./lesson-schema.js";
import {
  completeLesson,
  createLesson,
  getLesson,
  getQuizByLesson,
  submitQuiz,
} from "./lesson-service.js";

export async function handleGetLesson(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { lesson } = await getLesson(req.params.id);
  if (!lesson)
    throw new AppError({
      code: "NOT_FOUND",
      status: 404,
      message: "Lesson not found.",
    });
  return reply.code(200).send(lesson);
}

export async function handleGetQuiz(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { quiz } = await getQuizByLesson(req.params.id);
  if (!quiz)
    throw new AppError({
      code: "NOT_FOUND",
      status: 404,
      message: "Quiz not found.",
    });
  return reply.code(200).send(quiz);
}

export async function handleSubmitQuiz(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = req.params as { id: string };
  const body = req.body as z.infer<typeof quizSubmitSchema>;
  const userId = (req.user as any).sub;
  const { result } = await submitQuiz(userId, id, body);
  return reply.code(200).send(result);
}

export async function handleCompleteLesson(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = req.params as { id: string };
  const userId = (req.user as any).sub;
  await completeLesson(userId, id);
  return reply.code(204).send();
}

export async function handleCreateLesson(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const body = req.body as z.infer<typeof lessonCreateSchema>;
  const { lesson } = await createLesson(body);
  return reply.code(201).send(lesson);
}
