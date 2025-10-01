// src/models/lesson/lesson-service.ts
import type { z } from "zod";
import { prisma } from "../../db/prisma.js";
import { AppError } from "../../plugins/error-handler.js";
import { maybeAwardAfterLessonCompletion } from "../achievement/achievement-service.js";
import { quizSubmitSchema } from "./lesson-schema.js";

export async function getLesson(id: string) {
  const row = await prisma.lesson.findUnique({ where: { id } });
  if (!row) return { lesson: null as any };

  return {
    lesson: {
      id: row.id,
      module_id: row.module_id,
      title: row.title,
      content: row.content,
      order: row.order,
    },
  };
}

export async function getQuizByLesson(lessonId: string) {
  const quiz = await prisma.quiz.findFirst({
    where: { lesson_id: lessonId },
    include: {
      questions: {
        select: { id: true, question: true, options: true },
        orderBy: { id: "asc" },
      },
    },
  });

  if (!quiz) return { quiz: null as any };

  return {
    quiz: {
      id: quiz.id,
      lesson_id: quiz.lesson_id,
      title: quiz.title,
      questions: quiz.questions,
    },
  };
}

export async function submitQuiz(
  userId: string,
  lessonId: string,
  data: z.infer<typeof quizSubmitSchema>
) {
  const quiz = await prisma.quiz.findFirst({
    where: { lesson_id: lessonId },
    include: { questions: true },
  });

  if (!quiz) {
    throw new AppError({
      code: "NOT_FOUND",
      status: 404,
      message: "Quiz not found.",
    });
  }

  const map = new Map(data.answers.map((a) => [a.questionId, a.answer]));

  let correct = 0;
  const correctIds: string[] = [];
  const wrong: { questionId: string; expected: string; got: string }[] = [];

  for (const q of quiz.questions) {
    const got = map.get(q.id) ?? "";
    if (got === q.correct_answer) {
      correct++;
      correctIds.push(q.id);
    } else {
      wrong.push({ questionId: q.id, expected: q.correct_answer, got });
    }
  }

  const total = quiz.questions.length;
  const passed = correct === total;

  if (passed) {
    await prisma.userProgress.upsert({
      where: { user_id_lesson_id: { user_id: userId, lesson_id: lessonId } },
      create: { user_id: userId, lesson_id: lessonId },
      update: {},
    });

    await maybeAwardAfterLessonCompletion(userId, lessonId);
  }

  return { result: { total, correct, correctIds, wrong, passed } };
}

export async function completeLesson(userId: string, lessonId: string) {
  await prisma.userProgress.upsert({
    where: { user_id_lesson_id: { user_id: userId, lesson_id: lessonId } },
    create: { user_id: userId, lesson_id: lessonId },
    update: {},
  });

  await maybeAwardAfterLessonCompletion(userId, lessonId);
}
