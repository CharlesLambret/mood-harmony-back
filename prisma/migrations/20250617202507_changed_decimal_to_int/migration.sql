/*
  Warnings:

  - You are about to alter the column `speechiness` on the `Track` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `energy` on the `Track` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `speechiness` on the `UserGenrePreference` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `energy` on the `UserGenrePreference` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Track" ALTER COLUMN "speechiness" SET DATA TYPE INTEGER,
ALTER COLUMN "energy" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "UserGenrePreference" ALTER COLUMN "speechiness" SET DATA TYPE INTEGER,
ALTER COLUMN "energy" SET DATA TYPE INTEGER;
