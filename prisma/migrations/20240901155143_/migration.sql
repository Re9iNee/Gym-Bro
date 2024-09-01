-- CreateTable
CREATE TABLE "DailyTip" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "video_url" TEXT NOT NULL,
    "references" JSONB[],
    "lastShownDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DailyTip_pkey" PRIMARY KEY ("id")
);
