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
          bundle: z.enum(["BASIC", "PREMIUM", "VIP"]).nullable(),
          movieId: z.string(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // ticket stuff
      // const ticket = await ctx.prisma.ticket.create({
      //   data: {
      //     userId: input.ticket.userId,
      //     date: input.ticket.date,
      //     showtime: input.ticket.showtime,
      //     bundle: input.ticket.bundle,
      //     movieId: input.ticket.movieId,
      //   },
      // });
      // await ctx.prisma.seat.updateMany({
      //   where: {
      //     id: { in: input.ticket.seats },
      //   },
      //   data: {
      //     userId: input.ticket.userId,
      //   },
      // });

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
      //&ticket_id=${ticket.id}
      return stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card", "us_bank_account"],
        line_items,
        success_url: `${getURL()}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${getURL()}/reserve?session_id={CHECKOUT_SESSION_ID}`,
      });
    }),
});
