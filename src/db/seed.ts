import { faker } from "@faker-js/faker";
import { hash } from "bcrypt";
import { prisma } from "./prisma.js";

async function seed() {
  const users = await Promise.all(
    Array.from({ length: 10 }).map(async () => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: await hash(faker.internet.password(), 12),
    }))
  );

  await prisma.user.createMany({ data: users, skipDuplicates: true });
}

seed()
  .then(() => {
    console.log("success seeding data");
  })
  .catch((e) => {
    console.error("seed error: ", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
