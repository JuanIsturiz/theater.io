import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const ticketRouter = createTRPCRouter({
  getById: publicProcedure
    .input(
      z.object({
        ticketId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.ticket.findUnique({
        where: {
          id: input.ticketId,
        },
        include: {
          movie: true,
          seats: true,
          room: true,
        },
      });
    }),
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
  deleteTicket: publicProcedure
    .input(
      z.object({
        ticketId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.prisma.ticket.findUnique({
        where: {
          id: input.ticketId,
        },
        include: {
          seats: true,
        },
      });

      if (!ticket) throw new TRPCError({ code: "BAD_REQUEST" });

      await ctx.prisma.seat.updateMany({
        where: {
          id: { in: ticket.seats.map((seat) => seat.id) },
        },
        data: {
          userId: null,
        },
      });

      await ctx.prisma.ticket.update({
        where: {
          id: input.ticketId,
        },
        data: {
          seats: {
            disconnect: ticket.seats.map((seat) => ({ id: seat.id })),
          },
        },
      });

      await ctx.prisma.ticket.delete({
        where: {
          id: ticket.id,
        },
      });

      return true;
    }),
});
