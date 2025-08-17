import { faker } from "@faker-js/faker";
import request from "supertest";
import { expect, test } from "vitest";
import { server } from "../setup.js";

test("creating a user", async () => {
  const response = await request(server.server)
    .post("/api/users")
    .set("Content-Type", "application/json")
    .send({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: "fakepassword",
    });

  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty("id");
});
