/*
  Warnings:

  - You are about to drop the column `harvested_id` on the `farm_products` table. All the data in the column will be lost.
  - You are about to drop the column `planted_id` on the `farm_products` table. All the data in the column will be lost.
  - You are about to drop the column `sale_id` on the `farm_products` table. All the data in the column will be lost.
  - Added the required column `farm_product_id` to the `harvested` table without a default value. This is not possible if the table is not empty.
  - Added the required column `farm_product_id` to the `planted` table without a default value. This is not possible if the table is not empty.
  - Added the required column `farm_product_id` to the `sales` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."farm_products" DROP CONSTRAINT "farm_products_farm_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."farm_products" DROP CONSTRAINT "farm_products_harvested_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."farm_products" DROP CONSTRAINT "farm_products_planted_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."farm_products" DROP CONSTRAINT "farm_products_sale_id_fkey";

-- AlterTable
ALTER TABLE "farm_products" DROP COLUMN "harvested_id",
DROP COLUMN "planted_id",
DROP COLUMN "sale_id";

-- AlterTable
ALTER TABLE "harvested" ADD COLUMN     "farm_product_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "planted" ADD COLUMN     "farm_product_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "sales" ADD COLUMN     "farm_product_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "farm_products" ADD CONSTRAINT "farm_products_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "harvested" ADD CONSTRAINT "harvested_farm_product_id_fkey" FOREIGN KEY ("farm_product_id") REFERENCES "farm_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planted" ADD CONSTRAINT "planted_farm_product_id_fkey" FOREIGN KEY ("farm_product_id") REFERENCES "farm_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_farm_product_id_fkey" FOREIGN KEY ("farm_product_id") REFERENCES "farm_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
