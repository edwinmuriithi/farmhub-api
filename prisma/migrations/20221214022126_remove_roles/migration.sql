/*
  Warnings:

  - The values [FACILITY_ADMINISTRATOR,NURSE,CHW] on the enum `ROLE` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `facilityKmhflCode` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Facility` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Patient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Referral` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ROLE_new" AS ENUM ('ADMINISTRATOR', 'SYSTEM_ADMINISTRATOR', 'USER');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "ROLE_new" USING ("role"::text::"ROLE_new");
ALTER TYPE "ROLE" RENAME TO "ROLE_old";
ALTER TYPE "ROLE_new" RENAME TO "ROLE";
DROP TYPE "ROLE_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_facilityKmhflCode_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "facilityKmhflCode";

-- DropTable
DROP TABLE "Facility";

-- DropTable
DROP TABLE "Patient";

-- DropTable
DROP TABLE "Referral";

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);
