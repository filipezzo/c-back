import { z } from "zod";

export const lessonResponseSchema = z.object({
  id: z.uuid(),
  module_id: z.uuid(),
  title: z.string(),
  content: z.string(),
  order: z.number().int(),
});
