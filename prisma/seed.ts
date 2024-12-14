import prisma from "../src/database/prisma";
import { dailyTips, exercises, users } from "../src/lib/placeholder-data";

async function main() {
  await clearDB();
  await seedDailyTips();
  await seedExercises();
  await seedUsers();
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err
  );
});

async function seedUsers() {
  const formattedUsers = users.map((user) => ({
    ...user,
    id: undefined,
  }));

  const rows = await prisma.user.createMany({ data: formattedUsers });
  console.log(`🌱 Seeded ${rows.count} users`);
}

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
  const deletedUser = prisma.user.deleteMany();

  await prisma.$transaction([deletedDailyTip, deletedExercise, deletedUser]);

  console.log("✅ DB cleared!");
}
