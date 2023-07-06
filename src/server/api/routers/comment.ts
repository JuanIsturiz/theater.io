import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const commentRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.comment.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
  }),
  create: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        username: z.string(),
        content: z.string(),
        rating: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.comment.create({
        data: {
          userId: input.userId,
          username: input.username,
          content: input.content,
          rating: input.rating,
        },
      });
      return true;
    }),
  remove: publicProcedure
    .input(
      z.object({
        commentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.comment.delete({
        where: {
          id: input.commentId,
        },
      });
      return true;
    }),
});
