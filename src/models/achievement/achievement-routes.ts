import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { authGuard } from "../auth/auth-guard.js";
import {
  handleListAchievements,
  handleListMyAchievements,
} from "./achievement-controller.js";
import { achievementSchema } from "./achievement-schema.js";

export async function achievementRoutes(app: FastifyInstance) {
  app.get(
    "/achievements",
    {
      schema: {
        tags: ["achievements"],
        summary: "Lista todas as conquistas",
        response: { 200: z.array(achievementSchema) },
      },
    },
    handleListAchievements
  );

  app.get(
    "/me/achievements",
    {
      preHandler: authGuard,
      schema: {
        tags: ["achievements"],
        summary: "Lista minhas conquistas",
        response: { 200: z.array(achievementSchema) },
      },
    },
    handleListMyAchievements
  );
}
