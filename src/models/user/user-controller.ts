import type { FastifyReply, FastifyRequest } from "fastify";
import type {
  CreateUserInput,
  PatchUserInput,
  UserParams,
} from "./user-schema.js";
import {
  createUser,
  getUserById,
  getUsers,
  patchUsers,
} from "./user-service.js";

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

export async function handleGetUser(
  request: FastifyRequest<{ Params: UserParams }>,
  reply: FastifyReply
) {
  const { user } = await getUserById(request.params.id);
  return reply.code(200).send(user);
}

export async function handlePatchUser(
  request: FastifyRequest<{ Body: PatchUserInput; Params: UserParams }>,
  reply: FastifyReply
) {
  const { user } = await patchUsers({
    id: request.params.id,
    data: request.body,
  });

  return reply.status(200).send(user);
}
