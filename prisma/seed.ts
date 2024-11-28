import prisma from "../src/database/prisma";
import { dailyTips, exercises } from "../src/lib/placeholder-data";
import { exerciseSchema } from "../src/types/exercise.type";

async function testFn() {
  const exercises = await prisma.exercise.findMany();

  console.log(exercises);

  const result = exerciseSchema.safeParse(exercises?.[0]);
  if (result.success) {
    console.log("✅ Exercise schema is correct");
  } else {
    console.error("❌ Exercise schema is incorrect");
    console.error(result.error);
  }
}

async function main() {
  // await clearDB();
  // await seedDailyTips();
  // await seedExercises();

  await testFn();
}

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err
  );
});

async function seedDailyTips() {
  const formattedDTs = dailyTips.map((dt) => ({
    ...dt,
    id: undefined,
    references: JSON.stringify(dt.references),
  }));

  const rows = await prisma.dailyTip.createMany({ data: formattedDTs });
  console.log(`🌱 Seeded ${rows.count} daily tips`);
}

async function seedExercises() {
  const formattedExercises = exercises.map((exercise) => ({
    ...exercise,
    id: undefined,
    goals: { set: exercise.goals },
    focuses: { set: exercise.focuses },
    muscles: { set: exercise.muscles },
    equipments: { set: exercise.equipments },
  }));

  const rows = await prisma.exercise.createMany({ data: formattedExercises });
  console.log(`🌱 Seeded ${rows.count} exercises`);
}

async function clearDB() {
  console.log("🛑 Clearing DB...");

  const deletedDailyTip = prisma.dailyTip.deleteMany();
  const deletedExercise = prisma.exercise.deleteMany();

  await prisma.$transaction([deletedDailyTip, deletedExercise]);

  console.log("✅ DB cleared!");
}
