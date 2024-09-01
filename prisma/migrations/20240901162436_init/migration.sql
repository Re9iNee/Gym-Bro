/*
  Warnings:

  - Changed the type of `references` on the `DailyTip` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "DailyTip" DROP COLUMN "references",
ADD COLUMN     "references" JSONB NOT NULL;
