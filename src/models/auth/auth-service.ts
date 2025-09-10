import { compare, hash } from "bcrypt";
import { prisma } from "../../db/prisma.js";
import { AppError } from "../../plugins/error-handler.js";

export async function authLogin(email: string, password: string) {
  const u = await prisma.user.findUnique({ where: { email } });
  if (!u) {
    throw new AppError({
      code: "INVALID_CREDENTIALS",
      status: 401,
      message: "Invalid credentials",
    });
  }

  const ok = await compare(password, u.password);
  if (!ok) {
    throw new AppError({
      code: "INVALID_CREDENTIALS",
      status: 401,
      message: "Invalid credentials",
    });
  }

  const user = {
    id: u.id,
    name: u.name,
    email: u.email,
  };

  return { user, tokenVersion: u.tokenVersion };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  });

  if (!user) {
    throw new AppError({
      code: "NOT_FOUND",
      status: 401,
      message: "User not found",
    });
  }

  return { user };
}

export async function changeMyPassword(
  userId: string,
  oldPassword: string,
  newPassword: string
) {
  const u = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!u) {
    throw new AppError({
      code: "NOT_FOUND",
      status: 404,
      message: "User not found",
    });
  }

  const ok = compare(oldPassword, u.password);
  if (!ok) {
    throw new AppError({
      code: "INVALID_CREDENTIALS",
      status: 401,
      message: "Invalid credentials",
    });
  }

  const password = await hash(newPassword, 12);
  await prisma.user.update({
    where: { id: userId },
    data: {
      password,
      tokenVersion: { increment: 1 },
    },
  });
}
