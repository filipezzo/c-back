import { z } from "zod";

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

const createUserSchema = userCore.extend({
  password: z.string({
    error: "A senha é obrigatória.",
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
