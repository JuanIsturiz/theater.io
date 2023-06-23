const tableNames = [
  "Example",
  "Movie",
  "Room",
  "Screen",
  "Seat",
  "Ticket",
  "_ScreenToSeat",
];

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  for (const tableName of tableNames)
    await prisma.$queryRawUnsafe(
      `Truncate "${tableName}" restart identity cascade;`
    );
}

main().finally(async () => {
  console.log("Reset completed!");
  await prisma.$disconnect();
});
