import { faker } from "@faker-js/faker";
import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { prisma } from "../../db/prisma.js";
import {
  makeLesson,
  makeModule,
  makeQuizWithTwoQuestions,
} from "../factories.js";
import { server } from "../setup.js";

const testServer = server.server;

function getCookie(res: request.Response, name = "access_token") {
  const setCookie = res.headers["set-cookie"] as string[] | undefined;
  const cookie = setCookie?.find((c) => c.startsWith(`${name}=`));
  expect(cookie, "Expected access_token cookie").toBeDefined();
  return cookie!;
}

describe("Lesson Quiz", () => {
  beforeEach(async () => {
    await prisma.userProgress.deleteMany();
    await prisma.question.deleteMany();
    await prisma.quiz.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.module.deleteMany();
  });

  it("GET /api/lessons/:id/quiz -> retorna quiz sem gabarito", async () => {
    const mod = await makeModule();
    const lesson = await makeLesson(mod.id);
    const { quiz, q1, q2 } = await makeQuizWithTwoQuestions(lesson.id);

    const res = await request(testServer)
      .get(`/api/lessons/${lesson.id}/quiz`)
      .expect(200);

    expect(res.body).toMatchObject({
      id: quiz.id,
      lesson_id: lesson.id,
      title: quiz.title,
    });
    expect(Array.isArray(res.body.questions)).toBe(true);
    const ids = res.body.questions.map((q: any) => q.id);
    expect(ids).toEqual(expect.arrayContaining([q1.id, q2.id]));
    expect(res.body.questions[0]).not.toHaveProperty("correct_answer");
  });

  it("POST /api/lessons/:id/quiz/submit -> corrige e grava progresso quando acerta tudo", async () => {
    // user + login
    const email = faker.internet.email();
    const name = faker.person.firstName();
    const password = "secret123";
    await request(testServer)
      .post("/api/users")
      .send({ name, email, password })
      .expect(201);
    const login = await request(testServer)
      .post("/api/auth/login")
      .send({ email, password })
      .expect(200);
    const cookie = getCookie(login);

    const mod = await makeModule();
    const lesson = await makeLesson(mod.id);
    const { q1, q2 } = await makeQuizWithTwoQuestions(lesson.id);

    const submit = await request(testServer)
      .post(`/api/lessons/${lesson.id}/quiz/submit`)
      .set("Cookie", cookie)
      .send({
        answers: [
          { questionId: q1.id, answer: "4" },
          { questionId: q2.id, answer: "azul" },
        ],
      })
      .expect(200);

    expect(submit.body).toMatchObject({ total: 2, correct: 2, passed: true });

    const prog = await request(testServer)
      .get("/api/me/progress")
      .set("Cookie", cookie)
      .expect(200);
    expect(prog.body.find((p: any) => p.lesson_id === lesson.id)).toBeTruthy();
  });

  it("POST /api/lessons/:id/quiz/submit -> 401 sem cookie", async () => {
    const mod = await makeModule();
    const lesson = await makeLesson(mod.id);
    await makeQuizWithTwoQuestions(lesson.id);

    await request(testServer)
      .post(`/api/lessons/${lesson.id}/quiz/submit`)
      .send({ answers: [] })
      .expect(401);
  });
});
