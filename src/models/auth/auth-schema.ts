import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Email inválido."),
  password: z.string().min(6, "Senha inválida."),
});

export type LoginInput = z.output<typeof loginSchema>;

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export type ChangePasswordInput = z.output<typeof changePasswordSchema>;

export const meResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
});
