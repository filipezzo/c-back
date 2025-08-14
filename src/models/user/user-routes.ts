import type { FastifyInstance } from "fastify";
import { handlerUserRegister } from "./user-controller.js";

import { z } from "zod";
import { createUserSchema } from "./user-schema.js";

export async function userRoutes(fastity: FastifyInstance) {
  fastity.post(
    "/",
    {
      schema: {
        tags: ["users"],
        summary: "Crie um usuário",
        body: createUserSchema,
        response: {
          201: z.object({
            id: z.uuid(),
            name: z.string(),
            email: z.email(),
            created_at: z.iso.datetime(),
          }),
        },
      },
    },
    handlerUserRegister
  );
}
