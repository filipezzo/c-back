import { prisma } from "../../db/prisma.js";

export async function getLesson(id: string) {
  const row = await prisma.lesson.findUnique({ where: { id } });
  if (!row) return { lesson: null as any };

  const lesson = {
    id: row.id,
    module_id: row.module_id,
    title: row.title,
    content: row.content,
    order: row.order,
  };

  return { lesson };
}
