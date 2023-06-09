import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const movieRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.movie.findMany({
      include: {
        screens: {
          include: {
            room: true,
          },
        },
      },
    });
  }),
  getForCarousel: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.movie.findMany({
      take: 3,
    });
  }),
});
