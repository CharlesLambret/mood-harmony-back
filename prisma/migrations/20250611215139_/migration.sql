/*
  Warnings:

  - You are about to drop the column `iconUrl` on the `Emotion` table. All the data in the column will be lost.
  - You are about to drop the column `iconUrl` on the `Genre` table. All the data in the column will be lost.
  - You are about to drop the column `phases` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Session` table. All the data in the column will be lost.
  - The primary key for the `SessionTrack` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `sessionId` on the `SessionTrack` table. All the data in the column will be lost.
  - You are about to drop the column `EmoProfileId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserEmotionProfile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[emoProfileId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `icon_url` to the `Emotion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon_url` to the `Genre` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userEmotionProfileId` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionPhaseId` to the `SessionTrack` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emoProfileId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "SessionTrack" DROP CONSTRAINT "SessionTrack_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_EmoProfileId_fkey";

-- DropIndex
DROP INDEX "User_EmoProfileId_key";

-- AlterTable
ALTER TABLE "Emotion" DROP COLUMN "iconUrl",
ADD COLUMN     "icon_url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Genre" DROP COLUMN "iconUrl",
ADD COLUMN     "icon_url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "phases",
DROP COLUMN "userId",
ADD COLUMN     "userEmotionProfileId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SessionTrack" DROP CONSTRAINT "SessionTrack_pkey",
DROP COLUMN "sessionId",
ADD COLUMN     "sessionPhaseId" INTEGER NOT NULL,
ADD CONSTRAINT "SessionTrack_pkey" PRIMARY KEY ("sessionPhaseId", "trackId");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "EmoProfileId",
DROP COLUMN "password",
DROP COLUMN "phoneNumber",
ADD COLUMN     "emoProfileId" INTEGER NOT NULL,
ADD COLUMN     "password_hash" TEXT NOT NULL,
ADD COLUMN     "phone_number" TEXT;

-- AlterTable
ALTER TABLE "UserEmotionProfile" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "SessionPhase" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,

    CONSTRAINT "SessionPhase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_emoProfileId_key" ON "User"("emoProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_emoProfileId_fkey" FOREIGN KEY ("emoProfileId") REFERENCES "UserEmotionProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userEmotionProfileId_fkey" FOREIGN KEY ("userEmotionProfileId") REFERENCES "UserEmotionProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionPhase" ADD CONSTRAINT "SessionPhase_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionTrack" ADD CONSTRAINT "SessionTrack_sessionPhaseId_fkey" FOREIGN KEY ("sessionPhaseId") REFERENCES "SessionPhase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
