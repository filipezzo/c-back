import type { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  handleChangeMyPassword,
  handleLogin,
  handleLogout,
  handleMe,
} from "./auth-controller.js";
import { authGuard } from "./auth-guard.js";
import {
  changePasswordSchema,
  loginSchema,
  meResponseSchema,
} from "./auth-schema.js";

export async function authRoutes(app: FastifyInstance) {
  app.post(
    "/auth/login",
    {
      schema: {
        tags: ["auth"],
        summary: "Login",
        body: loginSchema,
        response: { 200: meResponseSchema },
      },
    },
    handleLogin
  );

  app.post(
    "/auth/logout",
    {
      schema: {
        tags: ["auth"],
        summary: "Logout",
        response: { 204: z.null() },
      },
    },
    handleLogout
  );

  app.get(
    "/me",
    {
      preHandler: authGuard,
      schema: {
        tags: ["auth"],
        summary: "Perfil autenticado",
        response: { 200: meResponseSchema },
      },
    },
    handleMe
  );

  app.patch(
    "/me/password",
    {
      preHandler: authGuard,
      schema: {
        tags: ["auth"],
        summary: "Trocar senha",
        body: changePasswordSchema,
        response: { 204: z.null() },
      },
    },
    handleChangeMyPassword
  );
}
