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

test("patching a user", async () => {
  const name = faker.person.firstName();
  const email = faker.internet.email();

  const createRes = await request(testServer)
    .post("/api/users")
    .set("Content-Type", "application/json")
    .send({
      name,
      email,
      password: "123456x",
    })
    .expect(201);

  const id = createRes.body.id;
  const newName = faker.person.firstName();
  const res = await request(testServer)
    .patch(`/api/users/${id}`)
    .set("Content-Type", "application/json")
    .send({ name: newName })
    .expect(200);

  expect(res.body).toHaveProperty("id");
  expect(res.body.name).toEqual(newName);
});

test("getting a user", async () => {
  const name = faker.person.firstName();
  const email = faker.internet.email();

  const createRes = await request(testServer)
    .post("/api/users")
    .set("Content-Type", "application/json")
    .send({
      name,
      email,
      password: "123456x",
    })
    .expect(201);
  const id = createRes.body.id;

  const res = await request(testServer).get(`/api/users/${id}`);
  expect(res.body).toHaveProperty("id");
  expect(id).toEqual(res.body.id);

  const randomUUID = crypto.randomUUID();

  const resp2 = await request(testServer).get(`/api/users/${randomUUID}`);
  expect(resp2.statusCode).toEqual(404);
  expect(resp2.body).toHaveProperty("error");
});

test("deleting a user", async () => {
  const name = faker.person.firstName();
  const email = faker.internet.email();

  const createRes = await request(testServer)
    .post("/api/users")
    .set("Content-Type", "application/json")
    .send({
      name,
      email,
      password: "123456x",
    })
    .expect(201);
  const id = createRes.body.id;

  const resp1 = await request(testServer).delete(`/api/users/${id}`);
  expect(resp1.statusCode).toEqual(204);
  expect(resp1.body).toStrictEqual({});

  const resp2 = await request(testServer).delete(`/api/users/${id}`);
  expect(resp2.statusCode).toEqual(404);
});
