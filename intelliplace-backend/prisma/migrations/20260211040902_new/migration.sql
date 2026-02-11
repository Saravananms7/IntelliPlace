/*
  Warnings:

  - You are about to drop the `aptitude_questions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `aptitude_submissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `aptitude_tests` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "aptitude_questions" DROP CONSTRAINT "aptitude_questions_test_id_fkey";

-- DropForeignKey
ALTER TABLE "aptitude_submissions" DROP CONSTRAINT "aptitude_submissions_student_id_fkey";

-- DropForeignKey
ALTER TABLE "aptitude_submissions" DROP CONSTRAINT "aptitude_submissions_test_id_fkey";

-- DropForeignKey
ALTER TABLE "aptitude_tests" DROP CONSTRAINT "aptitude_tests_job_id_fkey";

-- DropTable
DROP TABLE "aptitude_questions";

-- DropTable
DROP TABLE "aptitude_submissions";

-- DropTable
DROP TABLE "aptitude_tests";

-- CreateTable
CREATE TABLE "coding_tests" (
    "id" SERIAL NOT NULL,
    "job_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "allowed_languages" TEXT NOT NULL,
    "time_limit" INTEGER NOT NULL DEFAULT 60,
    "cutoff" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'CREATED',
    "started_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coding_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coding_questions" (
    "id" SERIAL NOT NULL,
    "test_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'MEDIUM',
    "points" INTEGER NOT NULL DEFAULT 10,
    "test_cases" TEXT NOT NULL,
    "expected_outputs" TEXT NOT NULL,
    "sample_input" TEXT,
    "sample_output" TEXT,
    "constraints" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coding_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coding_submissions" (
    "id" SERIAL NOT NULL,
    "test_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "language_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "status" TEXT,
    "score" DOUBLE PRECISION,
    "execution_time" DOUBLE PRECISION,
    "memory_used" INTEGER,
    "judge0_token" TEXT,
    "error_message" TEXT,
    "test_case_results" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coding_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "coding_tests_job_id_key" ON "coding_tests"("job_id");

-- CreateIndex
CREATE INDEX "coding_tests_job_id_idx" ON "coding_tests"("job_id");

-- CreateIndex
CREATE INDEX "coding_questions_test_id_idx" ON "coding_questions"("test_id");

-- CreateIndex
CREATE INDEX "coding_submissions_test_id_idx" ON "coding_submissions"("test_id");

-- CreateIndex
CREATE INDEX "coding_submissions_question_id_idx" ON "coding_submissions"("question_id");

-- CreateIndex
CREATE INDEX "coding_submissions_student_id_idx" ON "coding_submissions"("student_id");

-- AddForeignKey
ALTER TABLE "coding_tests" ADD CONSTRAINT "coding_tests_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coding_questions" ADD CONSTRAINT "coding_questions_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "coding_tests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coding_submissions" ADD CONSTRAINT "coding_submissions_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "coding_tests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coding_submissions" ADD CONSTRAINT "coding_submissions_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
