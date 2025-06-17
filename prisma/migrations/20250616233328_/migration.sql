/*
  Warnings:

  - You are about to drop the column `emoProfileId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userEmotionProfileId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[emotionProfileId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `emotionProfileId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_userEmotionProfileId_fkey";

-- DropIndex
DROP INDEX "User_emoProfileId_key";

-- DropIndex
DROP INDEX "User_userEmotionProfileId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emoProfileId",
DROP COLUMN "userEmotionProfileId",
ADD COLUMN     "emotionProfileId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_emotionProfileId_key" ON "User"("emotionProfileId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_emotionProfileId_fkey" FOREIGN KEY ("emotionProfileId") REFERENCES "UserEmotionProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
