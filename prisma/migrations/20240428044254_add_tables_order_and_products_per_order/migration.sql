-- CreateTable
CREATE TABLE "Products_per_order" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "priceId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "orderId" TEXT,

    CONSTRAINT "Products_per_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "adressesId" TEXT NOT NULL,
    "payment_method" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Products_per_order" ADD CONSTRAINT "Products_per_order_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_adressesId_fkey" FOREIGN KEY ("adressesId") REFERENCES "adresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
