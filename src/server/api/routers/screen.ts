import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const screenRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.screen.findMany({
      include: {
        room: true,
      },
    });
  }),
  getByMovieId: publicProcedure
    .input(
      z.object({
        movieId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.screen.findMany({
        where: {
          movieId: input.movieId,
        },
        include: {
          room: true,
        },
      });
    }),
});
