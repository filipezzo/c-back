import { z } from "zod";

export const achievementSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable().optional(),
  icon: z.string(),
});

export type AchievementDTO = z.infer<typeof achievementSchema>;
