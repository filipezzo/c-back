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
    error: "Preencha um email válido.",
  }),
});

export const createUserSchema = userCore.extend({
  password: z
    .string({
      error: "A senha é obrigatória.",
    })
    .min(6, "A senha deve conter no mínimo 6 caracteres."),
});

export const userParamsSchema = z.object({
  id: z.uuid(),
});

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(4, "Nome deve conter no minimo 4 caracteres.")
      .optional(),
    email: z.email({ error: "Digite um email válido." }).optional(),
    password: z
      .string({
        error: "A senha é obrigatória.",
      })
      .min(6, "A senha deve conter no mínimo 6 caracteres.")
      .optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    error: "Envie ao menos um campo para atualizar.",
  });

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type PatchUserInput = z.infer<typeof updateUserSchema>;
export type UserParams = z.infer<typeof userParamsSchema>;
