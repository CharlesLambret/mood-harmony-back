-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "EmoProfileId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserEmotionProfile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserEmotionProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserEmotion" (
    "id" SERIAL NOT NULL,
    "userEmotionProfileId" INTEGER NOT NULL,
    "emotionId" INTEGER NOT NULL,
    "genres" TEXT NOT NULL,

    CONSTRAINT "UserEmotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCustomGenreRate" (
    "id" SERIAL NOT NULL,
    "genreId" INTEGER NOT NULL,
    "userEmotionId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "bpm" INTEGER NOT NULL,
    "speechiness" INTEGER NOT NULL,
    "energy" INTEGER NOT NULL,

    CONSTRAINT "UserCustomGenreRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "iconUrl" TEXT NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Emotion" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "iconUrl" TEXT NOT NULL,

    CONSTRAINT "Emotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Track" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "length" INTEGER NOT NULL,
    "track_href" TEXT NOT NULL,
    "bpm" INTEGER NOT NULL,
    "genreId" INTEGER NOT NULL,
    "speechiness" INTEGER NOT NULL,
    "energy" INTEGER NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "duration" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "fromEmotionId" INTEGER NOT NULL,
    "toEmotionId" INTEGER NOT NULL,
    "phases" INTEGER NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionTrack" (
    "sessionId" INTEGER NOT NULL,
    "trackId" INTEGER NOT NULL,

    CONSTRAINT "SessionTrack_pkey" PRIMARY KEY ("sessionId","trackId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_EmoProfileId_key" ON "User"("EmoProfileId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_EmoProfileId_fkey" FOREIGN KEY ("EmoProfileId") REFERENCES "UserEmotionProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEmotion" ADD CONSTRAINT "UserEmotion_userEmotionProfileId_fkey" FOREIGN KEY ("userEmotionProfileId") REFERENCES "UserEmotionProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEmotion" ADD CONSTRAINT "UserEmotion_emotionId_fkey" FOREIGN KEY ("emotionId") REFERENCES "Emotion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCustomGenreRate" ADD CONSTRAINT "UserCustomGenreRate_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCustomGenreRate" ADD CONSTRAINT "UserCustomGenreRate_userEmotionId_fkey" FOREIGN KEY ("userEmotionId") REFERENCES "UserEmotion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_fromEmotionId_fkey" FOREIGN KEY ("fromEmotionId") REFERENCES "Emotion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_toEmotionId_fkey" FOREIGN KEY ("toEmotionId") REFERENCES "Emotion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionTrack" ADD CONSTRAINT "SessionTrack_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionTrack" ADD CONSTRAINT "SessionTrack_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
