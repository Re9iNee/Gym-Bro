/*
  Warnings:

  - You are about to drop the `UserExercise` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserExercise" DROP CONSTRAINT "UserExercise_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "UserExercise" DROP CONSTRAINT "UserExercise_userId_fkey";

-- DropTable
DROP TABLE "UserExercise";

-- CreateTable
CREATE TABLE "_ExerciseToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ExerciseToUser_AB_unique" ON "_ExerciseToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ExerciseToUser_B_index" ON "_ExerciseToUser"("B");

-- AddForeignKey
ALTER TABLE "_ExerciseToUser" ADD CONSTRAINT "_ExerciseToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseToUser" ADD CONSTRAINT "_ExerciseToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
