/*
  Warnings:

  - You are about to drop the column `name` on the `SessionPhase` table. All the data in the column will be lost.
  - You are about to drop the column `order_index` on the `SessionPhase` table. All the data in the column will be lost.
  - Added the required column `duration` to the `SessionPhase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phaseNumber` to the `SessionPhase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SessionPhase" DROP COLUMN "name",
DROP COLUMN "order_index",
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "phaseNumber" INTEGER NOT NULL;
