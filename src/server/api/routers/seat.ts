import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const seatRouter = createTRPCRouter({
  getByScreen: publicProcedure
    .input(
      z.object({
        screenId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.seat.findMany({
        where: {
          screenId: input.screenId,
        },
        orderBy: {
          id: "asc",
        },
      });
    }),
});
