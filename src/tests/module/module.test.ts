import { randomUUID } from "node:crypto";
import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { prisma } from "../../db/prisma.js";
import { makeModule, makeModuleWithLesson } from "../factories.js";
import { server } from "../setup.js";

const testServer = server.server;
const isISO = (s: unknown) =>
  typeof s === "string" && !Number.isNaN(Date.parse(String(s)));

describe("Modules (básico)", () => {
  beforeEach(async () => {
    await prisma.userProgress.deleteMany();
    await prisma.question.deleteMany();
    await prisma.quiz.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.module.deleteMany();
  });

  it("GET /api/modules -> retorna módulo criado", async () => {
    const m = await makeModule({
      title: "Introdução",
      description: "Comece aqui",
      order: 1,
    });
    console.log(m);

    const res = await request(testServer).get("/api/modules").expect(200);
    expect(res.body.length).toBeDefined();

    const mod = res.body[0];
    expect(mod).toBeDefined();
    expect(isISO(mod.created_at)).toBe(true);
  });

  it("GET /api/modules/:id -> retorna módulo e (se houver) lessons[]", async () => {
    const { mod, lesson } = await makeModuleWithLesson();

    const res = await request(testServer)
      .get(`/api/modules/${mod.id}`)
      .expect(200);

    expect(res.body).toMatchObject({
      id: mod.id,
      title: mod.title,
      description: mod.description,
      order: mod.order,
    });
    expect(isISO(res.body.created_at)).toBe(true);

    expect(Array.isArray(res.body.lessons)).toBe(true);
    expect(res.body.lessons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: lesson.id,
          title: lesson.title,
          order: lesson.order,
        }),
      ])
    );
  });

  it("GET /api/modules/:id -> 404 para id inexistente", async () => {
    const res = await request(testServer)
      .get(`/api/modules/${randomUUID()}`)
      .expect(404);
    expect(res.body).toHaveProperty("error");
  });
});
