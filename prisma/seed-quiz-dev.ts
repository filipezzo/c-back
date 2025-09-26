// prisma/seed-quiz-dev.ts
import { prisma } from "../src/db/prisma.js";

async function run() {
  let mod = await prisma.module.findFirst({ where: { title: "Introdução" } });
  if (!mod) {
    mod = await prisma.module.create({
      data: { title: "Introdução", description: "Comece aqui", order: 1 },
    });
  }

  let lesson = await prisma.lesson.findFirst({
    where: { module_id: mod.id, title: "Bem-vindo" },
  });
  if (!lesson) {
    lesson = await prisma.lesson.create({
      data: {
        module_id: mod.id,
        title: "Bem-vindo",
        content: "Conteúdo inicial da plataforma.",
        order: 1,
      },
    });
  }

  let quiz = await prisma.quiz.findFirst({ where: { lesson_id: lesson.id } });
  if (!quiz) {
    quiz = await prisma.quiz.create({
      data: { lesson_id: lesson.id, title: "Quiz da Lição 1" },
    });
  }

  await prisma.question.deleteMany({ where: { quiz_id: quiz.id } });

  const q1 = await prisma.question.create({
    data: {
      quiz_id: quiz.id,
      question: "Quanto é 2 + 2?",
      options: ["4", "3", "5"],
      correct_answer: "4",
    },
  });

  const q2 = await prisma.question.create({
    data: {
      quiz_id: quiz.id,
      question: "A cor do céu em um dia claro é…",
      options: ["vermelho", "azul", "verde"],
      correct_answer: "azul",
    },
  });

  console.log("Seed OK:");
  console.log({
    moduleId: mod.id,
    lessonId: lesson.id,
    quizId: quiz.id,
    q1: q1.id,
    q2: q2.id,
  });
}

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
