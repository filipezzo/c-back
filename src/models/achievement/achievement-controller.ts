import type { FastifyReply, FastifyRequest } from "fastify";
import {
  listAllAchievements,
  listMyAchievements,
} from "./achievement-service.js";

export async function handleListAchievements(
  _req: FastifyRequest,
  reply: FastifyReply
) {
  const items = await listAllAchievements();
  return reply.code(200).send(items);
}

export async function handleListMyAchievements(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const userId = (req.user as any).sub;
  const items = await listMyAchievements(userId);
  return reply.code(200).send(items);
}
