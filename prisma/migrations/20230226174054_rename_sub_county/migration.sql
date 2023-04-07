/*
  Warnings:

  - You are about to drop the column `subCountry` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "subCountry",
ADD COLUMN     "subCounty" TEXT;
