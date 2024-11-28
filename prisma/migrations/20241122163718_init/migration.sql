/*
  Warnings:

  - You are about to drop the column `equipment` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `focus` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `goal` on the `Exercise` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "equipment",
DROP COLUMN "focus",
DROP COLUMN "goal",
ADD COLUMN     "equipments" "Equipment"[],
ADD COLUMN     "focuses" "Focus"[],
ADD COLUMN     "goals" "Goal"[];
