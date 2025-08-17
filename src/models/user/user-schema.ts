import { z } from "zod";

export const userResponse = {
  id: true,
  name: true,
  email: true,
  created_at: true,
} as const;

export const userResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  created_at: z.date(),
});

const userCore = z.object({
  name: z
    .string({
      error: "O nome é obrigatório.",
    })
    .min(4, "Nome deve conter no mínimo 4 caracteres."),
  email: z.email({
    error: "O email é obrigatório.",
  }),
});

export const createUserSchema = userCore.extend({
  password: z.string({
    error: "A senha é obrigatória.",
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
