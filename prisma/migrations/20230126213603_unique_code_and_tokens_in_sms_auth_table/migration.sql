/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `SmsAuth` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token]` on the table `SmsAuth` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `SmsAuth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SmsAuth" ADD COLUMN     "token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SmsAuth_code_key" ON "SmsAuth"("code");

-- CreateIndex
CREATE UNIQUE INDEX "SmsAuth_token_key" ON "SmsAuth"("token");
