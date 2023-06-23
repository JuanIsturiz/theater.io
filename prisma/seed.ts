import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seed() {
  // initial imdbIds
  const imdbIds = [
    "697843",
    "298618",
    "385687",
    "812225",
    "882569",
    "545609",
    "717930",
    "569094",
  ];

  // initial room names
  const roomNames = ["room_1", "room_2", "room_3", "room_4"];

  // initial showtimes
  const showtimes = ["1:30pm", "4:00pm", "6:30pm", "9:00pm"];

  // dates array
  const dates = [];

  let day = new Date();

  for (let i = 0; i < 8; i++) {
    const nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    dates.push(nextDay.toLocaleDateString());
    day = nextDay;
  }
  // insert movies
  await prisma.movie.createMany({
    data: imdbIds.map((i) => ({ imdbId: i })),
  });

  // get movies
  const dbMovies = await prisma.movie.findMany();

  // insert rooms
  await prisma.room.createMany({
    data: roomNames.map((r) => ({ name: r })),
  });

  // get rooms
  const dbRooms = await prisma.room.findMany();

  if (!dbRooms.length) return;
  if (!dbMovies.length) return;

  // screens array
  const screens = [];
  for (let i = 0; i < dates.length; i++) {
    for (let j = 0; j < dbRooms.length; j++) {
      for (let k = 0; k < showtimes.length; k++) {
        if (!dbMovies[1] || !dbMovies[0]) return;
        if (!dbRooms[j]) return;
        const room = dbRooms[j];
        if (!room?.id) return;
        const date = dates[i];
        if (!date) return;
        const showtime = showtimes[k];
        if (!showtime) return;
        screens.push({
          movieId: (j + 1) % 2 === 0 ? dbMovies[1].id : dbMovies[0].id,
          roomId: room.id,
          date: new Date(date),
          showtime: showtime,
        });
      }
    }
    if ((i + 1) % 2 === 0) dbMovies.splice(0, 2);
  }

  // insert screens
  await prisma.screen.createMany({
    data: screens,
  });
}

seed()
  .then(async () => {
    console.log("Seeding complete!");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
