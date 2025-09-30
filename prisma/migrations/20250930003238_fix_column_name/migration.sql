/*
  Warnings:

  - You are about to drop the column `createdAt` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `farmers` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `farmers` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `admins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `farmers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admins" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "farmers" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
