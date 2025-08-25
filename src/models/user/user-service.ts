import type { Prisma } from "@prisma/client";
import bcrypt, { hash } from "bcrypt";
import { prisma } from "../../db/prisma.js";
import { AppError } from "../../plugins/error-handler.js";
import {
  userResponse,
  type CreateUserInput,
  type PatchUserInput,
} from "./user-schema.js";

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

export async function patchUsers({
  id,
  data,
}: {
  id: string;
  data: PatchUserInput;
}) {
  const { name, email, password } = data;

  if (email) {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists && exists.id !== id) {
      throw new AppError({
        code: "CONFLIT",
        status: 409,
        message: "User already exits",
        details: { email },
      });
    }
  }

  const payload: Prisma.UserUpdateInput = {
    ...(name !== undefined && { name }),
    ...(email !== undefined && { email }),
    ...(password !== undefined && { password: await hash(password, 12) }),
  };

  const user = await prisma.user.update({
    where: { id },
    data: payload,
    select: userResponse,
  });

  return { user };
}
