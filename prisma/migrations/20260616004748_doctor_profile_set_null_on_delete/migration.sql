-- DropForeignKey
ALTER TABLE "pvc_scan" DROP CONSTRAINT "pvc_scan_doctor_profile_id_fkey";

-- AddForeignKey
ALTER TABLE "pvc_scan" ADD CONSTRAINT "pvc_scan_doctor_profile_id_fkey" FOREIGN KEY ("doctor_profile_id") REFERENCES "doctor_profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
