import { prisma } from "../../db/prisma.js";

export async function awardAchievementIfMissing(
  userId: string,
  title: string,
  description?: string | null,
  icon = "trophy"
) {
  let ach = await prisma.achievement.findFirst({ where: { title } });
  if (!ach) {
    ach = await prisma.achievement.create({
      data: { title, description: description ?? null, icon },
    });
  }

  await prisma.userAchievement.upsert({
    where: {
      user_id_achievement_id: { user_id: userId, achievement_id: ach.id },
    },
    create: { user_id: userId, achievement_id: ach.id },
    update: {},
  });
}

export async function maybeAwardAfterLessonCompletion(
  userId: string,
  lessonId: string
) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { module_id: true },
  });
  if (!lesson) return;

  const totalUserProgress = await prisma.userProgress.count({
    where: { user_id: userId },
  });
  if (totalUserProgress === 1) {
    await awardAchievementIfMissing(
      userId,
      "Primeiros passos",
      "Você concluiu sua primeira lição!",
      "star"
    );
  }

  const [totalLessonsInModule, completedLessonsInModule] = await Promise.all([
    prisma.lesson.count({ where: { module_id: lesson.module_id } }),
    prisma.userProgress.count({
      where: { user_id: userId, lesson: { module_id: lesson.module_id } },
    }),
  ]);

  if (
    totalLessonsInModule > 0 &&
    completedLessonsInModule === totalLessonsInModule
  ) {
    const mod = await prisma.module.findUnique({
      where: { id: lesson.module_id },
      select: { title: true },
    });
    const modTitle = mod?.title ?? lesson.module_id;
    await awardAchievementIfMissing(
      userId,
      `Módulo concluído: ${modTitle}`,
      `Você concluiu o módulo ${modTitle}.`,
      "medal"
    );
  }
}

export async function listAllAchievements() {
  const rows = await prisma.achievement.findMany({ orderBy: { title: "asc" } });
  return rows.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description ?? undefined,
    icon: a.icon,
  }));
}

export async function listMyAchievements(userId: string) {
  const rows = await prisma.userAchievement.findMany({
    where: { user_id: userId },
    include: { achievement: true },
    orderBy: { achievement: { title: "asc" } },
  });

  return rows.map((r) => ({
    id: r.achievement.id,
    title: r.achievement.title,
    description: r.achievement.description ?? undefined,
    icon: r.achievement.icon,
  }));
}
