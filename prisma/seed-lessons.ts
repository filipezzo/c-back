// prisma/seed-lessons.ts
import { prisma } from "../src/db/prisma.js";

async function run() {
  const mod = await prisma.module.create({
    data: { title: "Introdução", description: "Comece aqui", order: 1 },
  });

  await prisma.lesson.createMany({
    data: [
      {
        module_id: mod.id,
        title: "Bem-vindo",
        content: "Conteúdo 1",
        order: 1,
      },
      {
        module_id: mod.id,
        title: "Setup do ambiente",
        content: "Conteúdo 2",
        order: 2,
      },
    ],
  });

  console.log("Seed ok:", { moduleId: mod.id });
}
run().finally(() => prisma.$disconnect());
