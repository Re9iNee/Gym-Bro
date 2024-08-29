async function main() {
  await seedDailyTips();
}

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err
  );
});

async function seedDailyTips() {}
