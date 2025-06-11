/*
  Warnings:

  - Added the required column `fromBpm` to the `SessionPhase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fromEnergy` to the `SessionPhase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fromSpeechiness` to the `SessionPhase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toBpm` to the `SessionPhase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toEnergy` to the `SessionPhase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toSpeechiness` to the `SessionPhase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SessionPhase" ADD COLUMN     "fromBpm" INTEGER NOT NULL,
ADD COLUMN     "fromEnergy" INTEGER NOT NULL,
ADD COLUMN     "fromSpeechiness" INTEGER NOT NULL,
ADD COLUMN     "toBpm" INTEGER NOT NULL,
ADD COLUMN     "toEnergy" INTEGER NOT NULL,
ADD COLUMN     "toSpeechiness" INTEGER NOT NULL;
