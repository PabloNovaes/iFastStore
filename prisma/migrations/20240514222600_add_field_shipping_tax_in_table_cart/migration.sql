/*
  Warnings:

  - Added the required column `shipping_tax` to the `shopping_cart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shopping_cart" ADD COLUMN     "shipping_tax" INTEGER NOT NULL;
