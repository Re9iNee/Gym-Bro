import prisma from "../src/database/prisma";
import { dailyTips } from "../src/lib/placeholder-data";

async function main() {
  await clearDB();
  await seedDailyTips();
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

async function clearDB() {
  console.log("🛑 Clearing DB...");

  const deletedDailyTip = prisma.dailyTip.deleteMany();

  await prisma.$transaction([deletedDailyTip]);

  console.log("✅ DB cleared!");
}
