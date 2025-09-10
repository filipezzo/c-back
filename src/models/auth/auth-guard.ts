import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../db/prisma.js";
import { AppError } from "../../plugins/error-handler.js";

// eslint-disable-next-line no-unused-vars
export async function authGuard(req: FastifyRequest, _reply: FastifyReply) {
  try {
    const payload = await req.jwtVerify<{ sub: string; tv?: number }>();
    const tv = payload.tv ?? 0;

    const u = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { tokenVersion: true },
    });

    if (!u || u.tokenVersion !== tv) {
      throw new AppError({
        code: "UNAUTHORIZED",
        status: 401,
        message: "Invalid token.",
      });
    }

    (req as any).auth = { userId: payload.sub };
  } catch {
    throw new AppError({
      code: "UNAUTHORIZED",
      status: 401,
      message: "Invalid token.",
    });
  }
}
