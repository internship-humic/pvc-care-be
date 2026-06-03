-- AlterTable
ALTER TABLE "pvc_scan" ALTER COLUMN "doctor_profile_id" DROP NOT NULL,
ALTER COLUMN "ai_result" DROP NOT NULL,
ALTER COLUMN "verification_status" SET DEFAULT 'Pending',
ALTER COLUMN "final_result" DROP NOT NULL,
ALTER COLUMN "doctor_note" DROP NOT NULL,
ALTER COLUMN "patient_note" DROP NOT NULL;
