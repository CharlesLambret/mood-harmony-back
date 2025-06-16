/*
  Warnings:

  - You are about to drop the column `icon_url` on the `Emotion` table. All the data in the column will be lost.
  - You are about to drop the column `icon_url` on the `Genre` table. All the data in the column will be lost.
  - Added the required column `iconUrl` to the `Emotion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iconUrl` to the `Genre` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Emotion" DROP COLUMN "icon_url",
ADD COLUMN     "iconUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Genre" DROP COLUMN "icon_url",
ADD COLUMN     "iconUrl" TEXT NOT NULL;
