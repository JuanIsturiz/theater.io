import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function getSeats(screenId: string) {
  const seats = [];
  const letters = "ABCDEFGH";
  let letterIdx = 0;
  for (let i = 1; i < 9; i++) {
    for (let j = 1; j < 13; j++) {
      seats.push({
        column: j,
        row: letters[letterIdx] || "",
        screenId,
      });
    }
    letterIdx++;
  }
  return seats;
}

async function seed() {
  // initial imdbIds
  const movies = [
    { imdbId: "697843", name: "Extraction 2" },
    { imdbId: "298618", name: "The Flash" },
    { imdbId: "385687", name: "Fast X" },
    { imdbId: "812225", name: "Black Clover: Sword of the Wizard King" },
    { imdbId: "882569", name: "Guy Ritchie's The Covenant" },
    { imdbId: "545609", name: "Extraction" },
    { imdbId: "717930", name: "Kandahar" },
    { imdbId: "569094", name: "Spider-Man: Across the Spider-Verse" },
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
    data: movies.map((movie) => movie),
  });

  // get movies
  const dbMovies = await prisma.movie.findMany();

  // insert rooms
  await prisma.room.createMany({
    data: roomNames.map((rn) => ({ name: rn })),
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

  const dbScreens = await prisma.screen.findMany();

  dbScreens.forEach(async (screen) => {
    const seats = getSeats(screen.id);

    await prisma.seat.createMany({
      data: seats,
    });
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
