import type { FastifyInstance } from "fastify";
import {
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

export async function userRoutes(fastity: FastifyInstance) {
  fastity.get(
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
  fastity.post(
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

  fastity.patch(
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
}
