-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "decision_reason" TEXT;

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "application_id" INTEGER,
ADD COLUMN     "job_id" INTEGER;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;
