import bcrypt from "bcrypt";
import { prisma } from "../../utils/prisma.js";
import type { CreateUserInput } from "./user-schema.js";

export async function createUser({ email, name, password }: CreateUserInput) {
  const password_hash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, name, password: password_hash },
    select: {
      id: true,
      name: true,
      email: true,
      created_at: true,
    } as const,
  });

  return user;
}
