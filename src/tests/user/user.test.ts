import { faker } from "@faker-js/faker";
import type { User } from "@prisma/client";
import request from "supertest";
import { expect, test } from "vitest";
import { server } from "../setup.js";

const testServer = server.server;

test("creating a user", async () => {
  const payload = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: "fakepassword",
  };

  const res = await request(testServer)
    .post("/api/users")
    .set("Content-Type", "application/json")
    .send(payload);

  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty("id");
  expect(res.body).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      email: res.body.email,
      name: res.body.name,
    })
  );
  expect(res.body.password).toBe(undefined);
});

test("listing all users", async () => {
  const res = await request(testServer).get("/api/users");

  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBeGreaterThanOrEqual(0);
  res.body.forEach((user: User) => {
    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("name");
    expect(user).toHaveProperty("email");
    expect(user).toHaveProperty("created_at");
    expect(user).not.toHaveProperty("password");
  });
});
