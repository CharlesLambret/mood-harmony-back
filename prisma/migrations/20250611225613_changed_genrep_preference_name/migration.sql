/*
  Warnings:

  - You are about to drop the column `password_hash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `UserCustomGenreRate` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserCustomGenreRate" DROP CONSTRAINT "UserCustomGenreRate_genreId_fkey";

-- DropForeignKey
ALTER TABLE "UserCustomGenreRate" DROP CONSTRAINT "UserCustomGenreRate_userEmotionId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password_hash",
ADD COLUMN     "passwordHash" TEXT NOT NULL;

-- DropTable
DROP TABLE "UserCustomGenreRate";

-- CreateTable
CREATE TABLE "UserGenrePreference" (
    "id" SERIAL NOT NULL,
    "genreId" INTEGER NOT NULL,
    "userEmotionId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "bpm" INTEGER NOT NULL,
    "speechiness" INTEGER NOT NULL,
    "energy" INTEGER NOT NULL,

    CONSTRAINT "UserGenrePreference_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserGenrePreference" ADD CONSTRAINT "UserGenrePreference_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGenrePreference" ADD CONSTRAINT "UserGenrePreference_userEmotionId_fkey" FOREIGN KEY ("userEmotionId") REFERENCES "UserEmotion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
