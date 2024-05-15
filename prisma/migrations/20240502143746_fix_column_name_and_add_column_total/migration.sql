/*
  Warnings:

  - You are about to drop the column `shippin_code` on the `orders` table. All the data in the column will be lost.
  - Added the required column `total` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "shippin_code",
ADD COLUMN     "shipping_code" TEXT,
ADD COLUMN     "total" INTEGER NOT NULL;
