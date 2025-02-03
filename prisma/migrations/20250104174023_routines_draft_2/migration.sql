/*
  Warnings:

  - A unique constraint covering the columns `[routineId,day]` on the table `RoutineDay` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RoutineDay_routineId_day_key" ON "RoutineDay"("routineId", "day");
