/*
  Warnings:

  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Products_per_order` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_adressesId_fkey";

-- DropForeignKey
ALTER TABLE "Products_per_order" DROP CONSTRAINT "Products_per_order_orderId_fkey";

-- DropTable
DROP TABLE "Order";

-- DropTable
DROP TABLE "Products_per_order";

-- CreateTable
CREATE TABLE "products_per_order" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "priceId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "orderId" TEXT,

    CONSTRAINT "products_per_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "shippin_code" TEXT,
    "userId" TEXT NOT NULL,
    "adressesId" TEXT NOT NULL,
    "payment_method" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "products_per_order" ADD CONSTRAINT "products_per_order_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_adressesId_fkey" FOREIGN KEY ("adressesId") REFERENCES "adresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
