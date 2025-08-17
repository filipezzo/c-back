import type { FastifyInstance } from "fastify";
import { handlerListUsers, handlerUserRegister } from "./user-controller.js";

import { z } from "zod";
import { createUserSchema, userResponseSchema } from "./user-schema.js";

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
}
