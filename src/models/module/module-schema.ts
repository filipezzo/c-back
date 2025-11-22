import { z } from "zod";

export const lessonHeadSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  order: z.number().int(),
});

export const moduleResponseSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string(),
  order: z.number().int(),
  created_at: z.iso.datetime(),
});

export const moduleWithLessonsSchema = moduleResponseSchema.extend({
  lessons: z.array(lessonHeadSchema),
});

export const moduleCreateSchema = z.object({
  title: z.string(),
  description: z.string(),
  order: z.number().int(),
});
