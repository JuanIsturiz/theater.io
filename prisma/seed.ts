import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const roomNames = ["room_1", "room_2", "room_3", "room_4"];

async function main() {
  const movies = await prisma.movie.createMany({
    data: [
      { imdbId: "697843" },
      { imdbId: "298618" },
      { imdbId: "385687" },
      { imdbId: "812225" },
      { imdbId: "882569" },
      { imdbId: "545609" },
      { imdbId: "717930" },
      { imdbId: "569094" },
    ],
  });
  const rooms = await prisma.room.createMany({
    data: roomNames.map((r) => ({ name: r })),
  });
  const screens = await prisma.screen.createMany({
    data: [],
    //todo add screens
  });
}

// example screen:
//     id        1
//     movie     {id: clj4kp62a0000uvwofy4xyxrb, imdbId: 697843}
//     movieId   697843
//     room      {id: 1, name: room_1}
//     roomId    1
//     seats     []
//     showtime  1:30
//     date      "2023-06-24"

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
