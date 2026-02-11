-- CreateTable
CREATE TABLE "students" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roll_number" TEXT,
    "cgpa" DOUBLE PRECISION,
    "backlog" INTEGER,
    "cv_url" TEXT,
    "cv_data" BYTEA,
    "phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" SERIAL NOT NULL,
    "company_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "industry" TEXT,
    "website" TEXT,
    "phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT,
    "type" TEXT NOT NULL,
    "salary" TEXT,
    "required_skills" TEXT,
    "min_cgpa" DOUBLE PRECISION,
    "include_cgpa_in_shortlisting" BOOLEAN DEFAULT true,
    "allow_backlog" BOOLEAN,
    "max_backlog" INTEGER,
    "job_description_file_url" TEXT,
    "deadline" TIMESTAMP(3),
    "company_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "job_id" INTEGER NOT NULL,
    "skills" TEXT,
    "cgpa" DOUBLE PRECISION,
    "backlog" INTEGER,
    "cv_url" TEXT,
    "cv_data" BYTEA,
    "decision_reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interviews" (
    "id" SERIAL NOT NULL,
    "application_id" INTEGER NOT NULL,
    "job_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_sessions" (
    "id" SERIAL NOT NULL,
    "interview_id" INTEGER NOT NULL,
    "mode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "current_question_index" INTEGER NOT NULL DEFAULT 0,
    "questions" TEXT NOT NULL,
    "answers" TEXT,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interview_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_question_answers" (
    "id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "question_index" INTEGER NOT NULL,
    "question_text" TEXT NOT NULL,
    "transcribed_text" TEXT,
    "audio_url" TEXT,
    "video_url" TEXT,
    "content_score" DOUBLE PRECISION,
    "confidence_score" DOUBLE PRECISION,
    "emotion_scores" TEXT,
    "overall_score" DOUBLE PRECISION,
    "feedback" TEXT,
    "analysis_data" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interview_question_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "decision_reason" TEXT,
    "job_id" INTEGER,
    "application_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "aptitude_tests" (
    "id" SERIAL NOT NULL,
    "job_id" INTEGER NOT NULL,
    "sections" JSONB NOT NULL,
    "cutoff" INTEGER,
    "total_questions" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'CREATED',
    "started_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "aptitude_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aptitude_questions" (
    "id" SERIAL NOT NULL,
    "test_id" INTEGER NOT NULL,
    "section" TEXT NOT NULL,
    "question_text" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "correct_index" INTEGER NOT NULL,
    "marks" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "aptitude_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aptitude_submissions" (
    "id" SERIAL NOT NULL,
    "test_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "answers" JSONB NOT NULL,
    "score" DOUBLE PRECISION,
    "percentage" DOUBLE PRECISION,
    "status" TEXT,
    "submitted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "aptitude_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");

-- CreateIndex
CREATE INDEX "students_email_idx" ON "students"("email");

-- CreateIndex
CREATE UNIQUE INDEX "companies_email_key" ON "companies"("email");

-- CreateIndex
CREATE INDEX "companies_email_idx" ON "companies"("email");

-- CreateIndex
CREATE INDEX "jobs_company_id_idx" ON "jobs"("company_id");

-- CreateIndex
CREATE INDEX "applications_student_id_idx" ON "applications"("student_id");

-- CreateIndex
CREATE INDEX "applications_job_id_idx" ON "applications"("job_id");

-- CreateIndex
CREATE UNIQUE INDEX "interviews_application_id_key" ON "interviews"("application_id");

-- CreateIndex
CREATE INDEX "interviews_application_id_idx" ON "interviews"("application_id");

-- CreateIndex
CREATE INDEX "interviews_job_id_idx" ON "interviews"("job_id");

-- CreateIndex
CREATE INDEX "interview_sessions_interview_id_idx" ON "interview_sessions"("interview_id");

-- CreateIndex
CREATE INDEX "interview_question_answers_session_id_idx" ON "interview_question_answers"("session_id");

-- CreateIndex
CREATE INDEX "interview_question_answers_question_index_idx" ON "interview_question_answers"("question_index");

-- CreateIndex
CREATE INDEX "notifications_student_id_idx" ON "notifications"("student_id");

-- CreateIndex
CREATE INDEX "notifications_read_idx" ON "notifications"("read");

-- CreateIndex
CREATE UNIQUE INDEX "admins_username_key" ON "admins"("username");

-- CreateIndex
CREATE INDEX "admins_username_idx" ON "admins"("username");

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

-- CreateIndex
CREATE UNIQUE INDEX "aptitude_tests_job_id_key" ON "aptitude_tests"("job_id");

-- CreateIndex
CREATE INDEX "aptitude_tests_job_id_idx" ON "aptitude_tests"("job_id");

-- CreateIndex
CREATE INDEX "aptitude_questions_test_id_idx" ON "aptitude_questions"("test_id");

-- CreateIndex
CREATE INDEX "aptitude_submissions_test_id_idx" ON "aptitude_submissions"("test_id");

-- CreateIndex
CREATE INDEX "aptitude_submissions_student_id_idx" ON "aptitude_submissions"("student_id");

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_sessions" ADD CONSTRAINT "interview_sessions_interview_id_fkey" FOREIGN KEY ("interview_id") REFERENCES "interviews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_question_answers" ADD CONSTRAINT "interview_question_answers_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "interview_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coding_tests" ADD CONSTRAINT "coding_tests_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coding_questions" ADD CONSTRAINT "coding_questions_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "coding_tests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coding_submissions" ADD CONSTRAINT "coding_submissions_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "coding_tests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coding_submissions" ADD CONSTRAINT "coding_submissions_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aptitude_tests" ADD CONSTRAINT "aptitude_tests_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aptitude_questions" ADD CONSTRAINT "aptitude_questions_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "aptitude_tests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aptitude_submissions" ADD CONSTRAINT "aptitude_submissions_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "aptitude_tests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aptitude_submissions" ADD CONSTRAINT "aptitude_submissions_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
