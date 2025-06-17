-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_emotionProfileId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "emotionProfileId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_emotionProfileId_fkey" FOREIGN KEY ("emotionProfileId") REFERENCES "UserEmotionProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
