/*
  Warnings:

  - You are about to drop the column `passwordChangedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordConfirm` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "passwordChangedAt",
DROP COLUMN "passwordConfirm";
