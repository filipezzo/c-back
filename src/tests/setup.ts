import { config } from "dotenv";
import { afterAll, beforeAll } from "vitest";
import { app } from "../app.js";
import { prisma } from "../db/prisma.js";

config({ path: ".env.test" });

export const server = app();

beforeAll(async () => await server.ready());

afterAll(async () => {
  await prisma.$disconnect();
  await server.close();
});
