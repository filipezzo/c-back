-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Module" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Lesson" (
    "id" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Quizzes" (
    "id" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Questions" (
    "id" TEXT NOT NULL,
    "quiz_id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "correct_answer" TEXT NOT NULL,
    "options" TEXT[],

    CONSTRAINT "Questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Achievement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserAchievement" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "achievement_id" TEXT NOT NULL,

    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserProgress" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "Module_created_at_idx" ON "public"."Module"("created_at");

-- CreateIndex
CREATE INDEX "Lesson_module_id_idx" ON "public"."Lesson"("module_id");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_module_id_order_key" ON "public"."Lesson"("module_id", "order");

-- CreateIndex
CREATE INDEX "Quizzes_lesson_id_idx" ON "public"."Quizzes"("lesson_id");

-- CreateIndex
CREATE INDEX "Questions_quiz_id_idx" ON "public"."Questions"("quiz_id");

-- CreateIndex
CREATE INDEX "UserAchievement_user_id_idx" ON "public"."UserAchievement"("user_id");

-- CreateIndex
CREATE INDEX "UserAchievement_achievement_id_idx" ON "public"."UserAchievement"("achievement_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserAchievement_user_id_achievement_id_key" ON "public"."UserAchievement"("user_id", "achievement_id");

-- CreateIndex
CREATE INDEX "UserProgress_user_id_idx" ON "public"."UserProgress"("user_id");

-- CreateIndex
CREATE INDEX "UserProgress_lesson_id_idx" ON "public"."UserProgress"("lesson_id");

-- CreateIndex
CREATE INDEX "UserProgress_completed_at_idx" ON "public"."UserProgress"("completed_at");

-- CreateIndex
CREATE UNIQUE INDEX "UserProgress_user_id_lesson_id_key" ON "public"."UserProgress"("user_id", "lesson_id");

-- AddForeignKey
ALTER TABLE "public"."Lesson" ADD CONSTRAINT "Lesson_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "public"."Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Quizzes" ADD CONSTRAINT "Quizzes_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "public"."Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Questions" ADD CONSTRAINT "Questions_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "public"."Quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserAchievement" ADD CONSTRAINT "UserAchievement_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserAchievement" ADD CONSTRAINT "UserAchievement_achievement_id_fkey" FOREIGN KEY ("achievement_id") REFERENCES "public"."Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserProgress" ADD CONSTRAINT "UserProgress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserProgress" ADD CONSTRAINT "UserProgress_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "public"."Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
