// src/tests/auth/auth.test.ts
import { faker } from "@faker-js/faker";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { server } from "../setup.js";

const testServer = server.server;

describe("Auth flow", () => {
  it("login -> /me -> logout -> /me 401 (usando agent)", async () => {
    const agent = request.agent(testServer);

    const payload = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: "secret123",
    };

    await agent
      .post("/api/users")
      .set("Content-Type", "application/json")
      .send(payload)
      .expect(201);

    await agent
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send({ email: payload.email, password: payload.password })
      .expect(200);

    await agent.get("/api/me").expect(200);

    await agent.post("/api/auth/logout").expect(204);

    await agent.get("/api/me").expect(401);
  });

  it("protected route", async () => {
    const res = await request(testServer).get("/api/me").expect(401);
    expect(res.body).toHaveProperty("error");
  });

  it("invalid cred", async () => {
    const res = await request(testServer)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send({ email: "nope@example.com", password: "wrongpass" })
      .expect(401);

    expect(res.body).toHaveProperty("error");
  });

  it("new login", async () => {
    const email = faker.internet.email();
    const name = faker.person.firstName();
    const oldPassword = "secret123";
    const newPassword = "newsecret123";

    await request(testServer)
      .post("/api/users")
      .set("Content-Type", "application/json")
      .send({ name, email, password: oldPassword })
      .expect(201);

    const login1 = await request(testServer)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send({ email, password: oldPassword })
      .expect(200);

    const cookieOld = login1.headers["set-cookie"]![0]!;

    await request(testServer)
      .patch("/api/me/password")
      .set("Content-Type", "application/json")
      .set("Cookie", cookieOld)
      .send({ oldPassword, newPassword })
      .expect(204);

    await request(testServer)
      .get("/api/me")
      .set("Cookie", cookieOld)
      .expect(401);

    const login2 = await request(testServer)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send({ email, password: newPassword })
      .expect(200);

    expect(login2.headers["set-cookie"]![0]!).toContain("access_token=");
  });
});
