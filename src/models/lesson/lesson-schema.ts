import { z } from "zod";

export const lessonResponseSchema = z.object({
  id: z.uuid(),
  module_id: z.uuid(),
  title: z.string(),
  content: z.string(),
  order: z.number().int(),
});

export const quizQuestionSchema = z.object({
  id: z.uuid(),
  question: z.string(),
  options: z.array(z.string()),
});

export const quizResponseSchema = z.object({
  id: z.uuid(),
  lesson_id: z.uuid(),
  title: z.string(),
  questions: z.array(quizQuestionSchema),
});

export const quizSubmitSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.uuid(),
      answer: z.string(),
    })
  ),
});

export const quizResultSchema = z.object({
  total: z.number().int(),
  correct: z.number().int(),
  correctIds: z.array(z.uuid()),
  wrong: z.array(
    z.object({
      questionId: z.uuid(),
      expected: z.string(),
      got: z.string(),
    })
  ),
  passed: z.boolean(),
});
