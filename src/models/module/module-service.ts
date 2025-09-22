import { prisma } from "../../db/prisma.js";

const toModuleDTO = (m: any) => ({
  id: m.id,
  title: m.title,
  description: m.description,
  order: m.order,
  created_at: m.created_at.toISOString(),
});

export async function listModules() {
  const rows = await prisma.module.findMany({
    orderBy: [{ order: "asc" }, { created_at: "asc" }],
  });

  return { modules: rows.map(toModuleDTO) };
}

export async function getModule(id: string) {
  const row = await prisma.module.findUnique({
    where: { id },
    include: {
      lessons: {
        select: { id: true, title: true, order: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!row) return { module: null as any };
  return {
    module: {
      ...toModuleDTO(row),
      lessons: row.lessons,
    },
  };
}
