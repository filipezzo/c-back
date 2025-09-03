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

  if (!users) {
    throw new AppError({
      code: "ERROR",
      status: 400,
      message: "Error while fetching users",
    });
  }

  return { users };
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: userResponse,
  });

  if (!user) {
    throw new AppError({
      code: "NOT_FOUND",
      status: 404,
      message: "User not found.",
      details: { id },
    });
  }
  return { user };
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

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });
  } catch (e: any) {
    if (e.code === "P2025") {
      throw new AppError({
        code: "NOT_FOUND",
        status: 404,
        message: "User not found",
        details: { id },
      });
    }
    if (e.code === "P2003") {
      throw new AppError({
        code: "CONFLICT",
        status: 409,
        message: "User has related records",
        details: e.meta ?? null,
      });
    }
    throw e;
  }
}
