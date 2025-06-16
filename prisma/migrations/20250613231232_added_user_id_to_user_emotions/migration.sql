/*
  Warnings:

  - Added the required column `userId` to the `UserEmotion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserEmotion" ADD COLUMN     "userId" INTEGER NOT NULL;
