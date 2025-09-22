import type { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../../plugins/error-handler.js";
import { getModule, listModules } from "./module-service.js";

export async function handleListModules(
  _: FastifyRequest,
  reply: FastifyReply
) {
  const { modules } = await listModules();
  return reply.code(200).send(modules);
}

export async function handleGetModule(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { module } = await getModule(req.params.id);
  if (!module) {
    throw new AppError({
      code: "NOT_FOUND",
      status: 404,
      message: "Module not found.",
    });
  }
  return reply.code(200).send(module);
}
