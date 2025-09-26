import type { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../../plugins/error-handler.js";
import { getLesson } from "./lesson-service.js";

export async function handleGetLesson(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { lesson } = await getLesson(req.params.id);
  if (!lesson) {
    throw new AppError({
      code: "NOT_FOUND",
      status: 404,
      message: "Lesson not found.",
    });
  }
  return reply.code(200).send(lesson);
}
