/*
  Warnings:

  - You are about to drop the `Questions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Quizzes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Questions" DROP CONSTRAINT "Questions_quiz_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Quizzes" DROP CONSTRAINT "Quizzes_lesson_id_fkey";

-- DropTable
DROP TABLE "public"."Questions";

-- DropTable
DROP TABLE "public"."Quizzes";

-- CreateTable
CREATE TABLE "public"."Quiz" (
    "id" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Question" (
    "id" TEXT NOT NULL,
    "quiz_id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "correct_answer" TEXT NOT NULL,
    "options" TEXT[],

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Quiz_lesson_id_idx" ON "public"."Quiz"("lesson_id");

-- CreateIndex
CREATE INDEX "Question_quiz_id_idx" ON "public"."Question"("quiz_id");

-- AddForeignKey
ALTER TABLE "public"."Quiz" ADD CONSTRAINT "Quiz_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "public"."Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Question" ADD CONSTRAINT "Question_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "public"."Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;
