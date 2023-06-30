import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { z } from "zod";
import { env } from "~/env.mjs";
import { getURL } from "~/lib/helpers";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export const paymentRouter = createTRPCRouter({
  checkout: publicProcedure
    .input(
      z.object({
        quantity: z.number().min(1).max(4),
        ticket: z.object({
          userId: z.string(),
          seats: z.array(z.string()),
          date: z.date(),
          showtime: z.string(),
          bundle: z.enum(["BASIC", "PREMIUM", "VIP"]).optional(),
          movieId: z.string(),
          roomId: z.string(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // ticket stuff
      const ticket = await ctx.prisma.ticket.create({
        data: {
          userId: input.ticket.userId,
          date: input.ticket.date,
          showtime: input.ticket.showtime,
          bundle: input.ticket.bundle,
          movieId: input.ticket.movieId,
          roomId: input.ticket.roomId,
        },
      });

      await ctx.prisma.ticket.update({
        where: {
          id: ticket.id,
        },
        data: {
          seats: {
            connect: input.ticket.seats.map((seat) => ({ id: seat })),
          },
        },
      });

      await ctx.prisma.seat.updateMany({
        where: {
          id: { in: input.ticket.seats },
        },
        data: {
          userId: input.ticket.userId,
        },
      });

      // stripe stuff
      let bundlePriceId: string | null;
      switch (input.ticket.bundle) {
        case "BASIC":
          bundlePriceId = env.BASIC_BUNDLE_PRICE_ID;
          break;
        case "PREMIUM":
          bundlePriceId = env.PREMIUM_BUNDLE_PRICE_ID;
          break;
        case "VIP":
          bundlePriceId = env.VIP_BUNDLE_PRICE_ID;
          break;
        default:
          bundlePriceId = null;
      }

      const line_items = !bundlePriceId
        ? [
            {
              price: env.TICKET_PRICE_ID,
              quantity: input.quantity,
            },
          ]
        : [
            {
              price: bundlePriceId,
              quantity: 1,
            },
            {
              price: env.TICKET_PRICE_ID,
              quantity: input.quantity,
            },
          ];

      return stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card", "us_bank_account"],
        line_items,
        success_url: `${getURL()}/payment/success?session_id={CHECKOUT_SESSION_ID}&ticket_id=${
          ticket.id
        }`,
        cancel_url: `${getURL()}/payment/cancel?session_id={CHECKOUT_SESSION_ID}&ticket_id=${
          ticket.id
        }`,
      });
    }),
  confirmPayment: publicProcedure
    .input(z.object({ sessionId: z.string(), ticketId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.prisma.ticket.findUnique({
        where: {
          id: input.ticketId,
        },
        include: {
          seats: true,
          movie: true,
          room: true,
        },
      });
      if (!ticket) throw new TRPCError({ code: "BAD_REQUEST" });
      if (ticket?.verified) {
        return { status: "already verified", ticket };
      } else {
        const session = await stripe.checkout.sessions.retrieve(
          input.sessionId
        );
        if (session.status === "complete") {
          await ctx.prisma.ticket.update({
            where: {
              id: ticket.id,
            },
            data: {
              verified: true,
            },
          });
          return { status: "verified", ticket };
        } else {
          throw new TRPCError({ code: "BAD_REQUEST" });
        }
      }
    }),
  cancelPayment: publicProcedure
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
