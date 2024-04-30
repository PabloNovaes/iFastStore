-- CreateTable
CREATE TABLE "shopping_cart" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "priceId" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "shopping_cart_pkey" PRIMARY KEY ("id")
);
