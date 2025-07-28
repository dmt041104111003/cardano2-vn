-- AlterTable
ALTER TABLE "User" 
ADD COLUMN "email" TEXT,
ADD COLUMN "provider" TEXT;

-- CreateIndex
CREATE INDEX "User_provider_idx" ON "User"("provider");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "wallet" DROP NOT NULL; 