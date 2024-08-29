-- CreateTable
CREATE TABLE "DailyTip" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "video_url" TEXT NOT NULL,
    "references" JSONB[],
    "lastShownDate" TIMESTAMP(3),

    CONSTRAINT "DailyTip_pkey" PRIMARY KEY ("id")
);
