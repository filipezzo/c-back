import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateUserInput } from "./user-schema.js";
import { createUser } from "./user-service.js";

export async function handlerUserRegister(
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) {
  try {
    const { email, name, password } = request.body;
    const user = await createUser({ email, name, password });
    return reply.code(201).send(user);
  } catch (error) {
    console.error(error);
    return reply.code(500).send(error);
  }
}
