import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateUserInput } from "./user-schema.js";
import { createUser, getUsers } from "./user-service.js";

export async function handlerUserRegister(
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) {
  const { email, name, password } = request.body;
  const { user } = await createUser({ email, name, password });
  return reply.code(201).send(user);
}

export async function handlerListUsers(_: FastifyRequest, reply: FastifyReply) {
  const { users } = await getUsers();
  return reply.code(200).send(users);
}
