-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('Admin', 'Doctor', 'Patient');

-- CreateEnum
CREATE TYPE "GenderType" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "VerificationStatusType" AS ENUM ('Pending', 'Verified');

-- CreateEnum
CREATE TYPE "DoctorVerificationStatus" AS ENUM ('Pending', 'Declined', 'Verified');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "RoleType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_profile" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "gender" "GenderType" NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_profile" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "gender" "GenderType" NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "profile_photo" TEXT NOT NULL,
    "verification_status" "DoctorVerificationStatus" NOT NULL DEFAULT 'Pending',

    CONSTRAINT "doctor_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pvc_scan" (
    "id" TEXT NOT NULL,
    "patient_profile_id" TEXT NOT NULL,
    "doctor_profile_id" TEXT NOT NULL,
    "document_url" TEXT NOT NULL,
    "ai_result" TEXT NOT NULL,
    "verification_status" "VerificationStatusType" NOT NULL,
    "final_result" TEXT NOT NULL,
    "doctor_note" TEXT NOT NULL,
    "patient_note" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pvc_scan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "patient_profile_user_id_key" ON "patient_profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_profile_user_id_key" ON "doctor_profile"("user_id");

-- AddForeignKey
ALTER TABLE "patient_profile" ADD CONSTRAINT "patient_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_profile" ADD CONSTRAINT "doctor_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pvc_scan" ADD CONSTRAINT "pvc_scan_patient_profile_id_fkey" FOREIGN KEY ("patient_profile_id") REFERENCES "patient_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pvc_scan" ADD CONSTRAINT "pvc_scan_doctor_profile_id_fkey" FOREIGN KEY ("doctor_profile_id") REFERENCES "doctor_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
