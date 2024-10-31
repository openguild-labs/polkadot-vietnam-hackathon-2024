-- CreateEnum
CREATE TYPE "PoolStatus" AS ENUM ('PENDING', 'STARTING', 'ENDING');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "wallet_address" TEXT NOT NULL DEFAULT '0x0',
    "balance" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pool" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "creator" TEXT NOT NULL,
    "borrower" TEXT NOT NULL DEFAULT '0x0',
    "lend_token_symbol" TEXT NOT NULL,
    "collateral_token_symbol" TEXT NOT NULL,
    "lend_token" TEXT NOT NULL,
    "collateral_token" TEXT NOT NULL,
    "lend_amount" INTEGER NOT NULL,
    "collateral_amount" INTEGER NOT NULL DEFAULT 0,
    "profit" INTEGER NOT NULL DEFAULT 0,
    "expire" INTEGER NOT NULL,
    "pool_status" "PoolStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "receiver" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "to_smart_contract" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_Pool" (
    "userId" TEXT NOT NULL,
    "poolId" TEXT NOT NULL,

    CONSTRAINT "User_Pool_pkey" PRIMARY KEY ("poolId","userId")
);

-- CreateTable
CREATE TABLE "User_Transaction" (
    "userId" TEXT NOT NULL,
    "transationId" TEXT NOT NULL,

    CONSTRAINT "User_Transaction_pkey" PRIMARY KEY ("transationId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_wallet_address_key" ON "User"("wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_hash_key" ON "Transaction"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "User_Transaction_userId_key" ON "User_Transaction"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_Transaction_transationId_key" ON "User_Transaction"("transationId");

-- AddForeignKey
ALTER TABLE "User_Pool" ADD CONSTRAINT "User_Pool_poolId_fkey" FOREIGN KEY ("poolId") REFERENCES "Pool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Pool" ADD CONSTRAINT "User_Pool_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Transaction" ADD CONSTRAINT "User_Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Transaction" ADD CONSTRAINT "User_Transaction_transationId_fkey" FOREIGN KEY ("transationId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
