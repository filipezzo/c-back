import bcrypt from "bcrypt";
import { prisma } from "../../db/prisma.js";
import { AppError } from "../../plugins/error-handler.js";
import { userResponse, type CreateUserInput } from "./user-schema.js";

export async function createUser({ email, name, password }: CreateUserInput) {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    throw new AppError({
      code: "CONFLIT",
      status: 409,
      message: "User already exits",
      details: { email },
    });
  }
  const password_hash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, name, password: password_hash },
    select: userResponse,
  });

  return { user };
}

export async function getUsers() {
  const users = await prisma.user.findMany({
    select: userResponse,
  });

  return { users };
}
