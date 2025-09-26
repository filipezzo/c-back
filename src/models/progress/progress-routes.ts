import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../db/prisma.js";
import { authGuard } from "../auth/auth-guard.js";

const progressItemSchema = z.object({
  lesson_id: z.uuid(),
  completed_at: z.iso.datetime(),
});

export async function progressRoutes(app: FastifyInstance) {
  app.get(
    "/me/progress",
    {
      preHandler: authGuard,
      schema: {
        tags: ["progress"],
        summary: "Meu progresso",
        response: { 200: z.array(progressItemSchema) },
      },
    },
    async (req, reply) => {
      const userId = (req.user as any).sub;
      const rows = await prisma.userProgress.findMany({
        where: { user_id: userId },
        orderBy: { completed_at: "desc" },
      });
      const items = rows.map((r) => ({
        lesson_id: r.lesson_id,
        completed_at: r.completed_at.toISOString(),
      }));
      return reply.code(200).send(items);
    }
  );
}
