import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const ticketRouter = createTRPCRouter({
  getByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.ticket.findMany({
        where: {
          userId: input.userId,
        },
        include: {
          movie: true,
          seats: true,
          room: true,
        },
      });
    }),
});
