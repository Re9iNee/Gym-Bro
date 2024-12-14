-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('DARK_SOULS', 'HARD', 'MEDIUM', 'EASY');

-- CreateEnum
CREATE TYPE "Equipment" AS ENUM ('BODY_WEIGHT', 'BARBELL', 'DUMBBELL', 'KETTLEBELL', 'MEDICINE_BALL', 'RESISTANCE_BAND', 'SAND_BAG', 'SLAM_BALL', 'SLED', 'WEIGHT_PLATE', 'BOX', 'BENCH', 'PULL_UP_BAR', 'RINGS', 'PARALLETTES', 'JUMP_ROPE', 'ROWER', 'BIKE', 'TREADMILL', 'SKIERG', 'STAIR_MASTER', 'ELLIPTICAL', 'SWIMMING_POOL', 'TRACK', 'FIELD', 'SLEDGE_HAMMER', 'TIRES');

-- CreateEnum
CREATE TYPE "Muscle" AS ENUM ('NECK', 'REAR_DELTS', 'FRONT_DELTS', 'LATERAL_DELTS', 'TRAPS', 'UPPER_CHEST', 'LOWER_CHEST', 'MIDDLE_CHEST', 'LATS', 'UPPER_BACK', 'LOWER_BACK', 'BICEPS', 'TRICEPS', 'FOREARMS', 'ABS', 'V_Line', 'OBLIQUES', 'QUADS', 'CALVES', 'GLUTES', 'ADDUCTORS', 'ABDUCTORS', 'HAMSTRINGS', 'HIP_FLEXORS');

-- CreateEnum
CREATE TYPE "Goal" AS ENUM ('FAT_BURNING', 'WEIGHT_LOSS', 'PERFORMANCE', 'MUSCLE_GAIN', 'STRENGTH', 'FLEXIBILITY', 'ENDURANCE', 'BALANCE', 'COORDINATION', 'AGILITY', 'SPEED', 'POWER', 'CARDIO', 'MUSCLE_TONE', 'MUSCLE_DEFINITION', 'MUSCLE_HYPERTROPHY', 'MUSCLE_MAINTENANCE', 'MUSCLE_RECOVERY', 'MUSCLE_REHABILITATION', 'MUSCLE_ACTIVATION', 'MUSCLE_RELAXATION', 'MUSCLE_MOBILITY', 'MUSCLE_STABILITY', 'MUSCLE_EXPLOSIVENESS');

-- CreateEnum
CREATE TYPE "Focus" AS ENUM ('UPPER_BODY', 'LOWER_BODY', 'FULL_BODY', 'CORE', 'ARMS', 'LEGS', 'BACK', 'CHEST', 'SHOULDERS', 'GLUTES', 'STRETCH', 'MINDFULNESS', 'WARM_UP', 'COOL_DOWN');

-- CreateTable
CREATE TABLE "DailyTip" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "video_url" TEXT NOT NULL,
    "references" JSONB NOT NULL,
    "lastShownDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DailyTip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" SERIAL NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "name" TEXT NOT NULL,
    "muscles" "Muscle"[],
    "tips" TEXT[],
    "steps" TEXT[],
    "alternate_names" TEXT[],
    "video_url" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "equipments" "Equipment"[],
    "focuses" "Focus"[],
    "goals" "Goal"[],

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "weight" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "name" TEXT,
    "goals" "Goal"[],
    "gender" TEXT,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "birthday" TIMESTAMP(3),
    "age" INTEGER,
    "avatar" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserExercise" (
    "userId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,

    CONSTRAINT "UserExercise_pkey" PRIMARY KEY ("userId","exerciseId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "UserExercise" ADD CONSTRAINT "UserExercise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserExercise" ADD CONSTRAINT "UserExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
