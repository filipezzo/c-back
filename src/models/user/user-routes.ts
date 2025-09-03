import type { FastifyInstance } from "fastify";
import {
  handleDeleteUser,
  handleGetUser,
  handlePatchUser,
  handlerListUsers,
  handlerUserRegister,
} from "./user-controller.js";

import { z } from "zod";
import {
  createUserSchema,
  updateUserSchema,
  userParamsSchema,
  userResponseSchema,
} from "./user-schema.js";

export async function userRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      schema: {
        tags: ["users"],
        summary: "Lista os usuários",
        response: {
          200: z.array(userResponseSchema),
        },
      },
    },
    handlerListUsers
  );

  fastify.get(
    "/:id",
    {
      schema: {
        tags: ["users"],
        summary: "Busca informações de um usuário",
        params: userParamsSchema,
        response: { 200: userResponseSchema },
      },
    },
    handleGetUser
  );
  fastify.post(
    "/",
    {
      schema: {
        tags: ["users"],
        summary: "Crie um usuário",
        body: createUserSchema,
        response: {
          201: userResponseSchema,
        },
      },
    },
    handlerUserRegister
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        tags: ["users"],
        summary: "Atualize um usuário",
        params: userParamsSchema,
        body: updateUserSchema,
        response: {
          200: userResponseSchema,
        },
      },
    },
    handlePatchUser
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        tags: ["users"],
        summary: "Remove um usuário",
        params: userParamsSchema,
        response: {
          204: z.null(),
        },
      },
    },
    handleDeleteUser
  );
}
