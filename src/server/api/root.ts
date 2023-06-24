import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { movieRouter } from "./routers/movie";
import { screenRouter } from "./routers/screen";
import { seatRouter } from "./routers/seat";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  movie: movieRouter,
  screen: screenRouter,
  seat: seatRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
