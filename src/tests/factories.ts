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
