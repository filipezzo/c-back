import { randomUUID } from "node:crypto";
import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { prisma } from "../../db/prisma.js";
import { makeLesson, makeModule } from "../factories.js";
import { server } from "../setup.js";

const testServer = server.server;

describe("Lessons (básico)", () => {
  beforeEach(async () => {
    await prisma.userProgress.deleteMany();
    await prisma.question.deleteMany();
    await prisma.quiz.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.module.deleteMany();
  });

  it("GET /api/lessons/:id -> retorna uma lição", async () => {
    const mod = await makeModule({ title: "Módulo X", order: 1 });
    const lesson = await makeLesson(mod.id, {
      title: "Lição 1",
      content: "Conteúdo da lição 1",
      order: 1,
    });

    const res = await request(testServer)
      .get(`/api/lessons/${lesson.id}`)
      .expect(200);

    expect(res.body).toMatchObject({
      id: lesson.id,
      module_id: mod.id,
      title: "Lição 1",
      content: "Conteúdo da lição 1",
      order: 1,
    });
  });

  it("GET /api/lessons/:id -> 404 para id inexistente", async () => {
    const res = await request(testServer)
      .get(`/api/lessons/${randomUUID()}`)
      .expect(404);

    expect(res.body).toHaveProperty("error");
  });
});
