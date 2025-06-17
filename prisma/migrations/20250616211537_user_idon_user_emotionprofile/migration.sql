/*
  Warnings:

  - A unique constraint covering the columns `[userEmotionProfileId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `UserEmotionProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userEmotionProfileId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `UserEmotionProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_emoProfileId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userEmotionProfileId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "UserEmotionProfile" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_userEmotionProfileId_key" ON "User"("userEmotionProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "UserEmotionProfile_userId_key" ON "UserEmotionProfile"("userId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userEmotionProfileId_fkey" FOREIGN KEY ("userEmotionProfileId") REFERENCES "UserEmotionProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
