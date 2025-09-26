import { faker } from "@faker-js/faker";
import { prisma } from "../db/prisma.js";

export async function makeModule(data?: {
  title?: string;
  description?: string;
  order?: number;
}) {
  return prisma.module.create({
    data: {
      title: data?.title ?? faker.lorem.words(2),
      description: data?.description ?? faker.lorem.sentence(),
      order: data?.order ?? 1,
    },
  });
}

export async function makeLesson(
  moduleId: string,
  data?: { title?: string; content?: string; order?: number }
) {
  return prisma.lesson.create({
    data: {
      module_id: moduleId,
      title: data?.title ?? "Lição 1",
      content: data?.content ?? "Conteúdo da lição 1",
      order: data?.order ?? 1,
    },
  });
}

export async function makeModuleWithLesson() {
  const mod = await makeModule();
  const lesson = await makeLesson(mod.id);
  return { mod, lesson };
}

export async function makeQuiz(lessonId: string, title = "Quiz da lição") {
  return prisma.quiz.create({ data: { lesson_id: lessonId, title } });
}

export async function makeQuestion(
  quizId: string,
  data?: {
    question?: string;
    options?: string[];
    correct_answer?: string;
  }
) {
  const options = data?.options ?? ["a", "b", "c"];
  const correct = data?.correct_answer ?? options[0];
  return prisma.question.create({
    data: {
      quiz_id: quizId,
      question: data?.question ?? "Pergunta?",
      options,
      correct_answer: correct ?? "a",
    },
  });
}

export async function makeQuizWithTwoQuestions(lessonId: string) {
  const quiz = await makeQuiz(lessonId);
  const q1 = await makeQuestion(quiz.id, {
    question: "2+2?",
    options: ["4", "5", "3"],
    correct_answer: "4",
  });
  const q2 = await makeQuestion(quiz.id, {
    question: "Cor do céu?",
    options: ["azul", "verde", "vermelho"],
    correct_answer: "azul",
  });
  return { quiz, q1, q2 };
}
