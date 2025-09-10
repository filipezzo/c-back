import type { FastifyReply, FastifyRequest } from "fastify";
import { NODE_ENV } from "../../env.js";
import type { ChangePasswordInput, LoginInput } from "./auth-schema.js";
import { authLogin, changeMyPassword, getMe } from "./auth-service.js";

export async function handleLogin(
  req: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply
) {
  const { email, password } = req.body;
  const { user, tokenVersion } = await authLogin(email, password);

  const token = await reply.jwtSign(
    { sub: user.id, tv: tokenVersion },
    { expiresIn: "2h" }
  );

  reply.setCookie("access_token", token, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 2,
  });

  return reply.code(200).send(user);
}

export async function handleMe(req: FastifyRequest, reply: FastifyReply) {
  const { sub } = (req.user ?? {}) as { sub: string };
  const { user } = await getMe(sub);
  return reply.code(200).send(user);
}

export async function handleLogout(_req: FastifyRequest, reply: FastifyReply) {
  reply.clearCookie("access_token", { path: "/" });
  return reply.code(204).send();
}

export async function handleChangeMyPassword(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { sub } = (req.user ?? {}) as { sub: string };
  const { oldPassword, newPassword } = req.body as ChangePasswordInput;

  await changeMyPassword(sub, oldPassword, newPassword);
  reply.clearCookie("access_token", { path: "/" });
  return reply.code(204).send();
}
