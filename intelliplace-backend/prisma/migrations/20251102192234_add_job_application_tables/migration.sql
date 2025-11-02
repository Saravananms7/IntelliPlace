-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "backlog" INTEGER,
ADD COLUMN     "cgpa" DOUBLE PRECISION,
ADD COLUMN     "cv_data" BYTEA,
ADD COLUMN     "cv_url" TEXT,
ADD COLUMN     "skills" TEXT;

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "allow_backlog" BOOLEAN,
ADD COLUMN     "min_cgpa" DOUBLE PRECISION,
ADD COLUMN     "required_skills" TEXT;

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "backlog" INTEGER,
ADD COLUMN     "cgpa" DOUBLE PRECISION,
ADD COLUMN     "cv_data" BYTEA,
ADD COLUMN     "cv_url" TEXT;
