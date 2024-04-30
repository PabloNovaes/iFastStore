-- CreateTable
CREATE TABLE "adresses" (
    "id" TEXT NOT NULL,
    "complement" TEXT,
    "city" TEXT NOT NULL,
    "cap" INTEGER NOT NULL,
    "street" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cellphone" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "adresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "adresses_userId_key" ON "adresses"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "adresses_cellphone_key" ON "adresses"("cellphone");

-- CreateIndex
CREATE UNIQUE INDEX "adresses_email_key" ON "adresses"("email");
