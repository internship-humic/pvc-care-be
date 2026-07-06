-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('VerificationComplete', 'NewScanAssigned', 'DoctorVerified', 'DoctorDeclined', 'ReminderCheckup');

-- AlterTable: Add specialization with a temporary default to handle existing rows
ALTER TABLE "doctor_profile" ADD COLUMN "specialization" TEXT NOT NULL DEFAULT 'General';
-- Remove the default so future inserts must provide a value
ALTER TABLE "doctor_profile" ALTER COLUMN "specialization" DROP DEFAULT;

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
