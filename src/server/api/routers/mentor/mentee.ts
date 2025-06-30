import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { mentoringSchedule, userMentoringData } from "~/server/db/schema";
import {
  ResponseSessionSchema,
  UserMentoringDataIdSchema,
} from "~/server/validator/mentoring";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const menteeRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      const mentoringData = await ctx.db.query.mentor.findFirst({
        where: (mentor, { eq }) => eq(mentor.userId, ctx.session.user.id),
        with: {
          mentoring: {
            columns: {
              id: true,
            },
          },
        },
        columns: {
          id: true,
        },
      });

      if (!mentoringData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Mentor not found",
        });
      }

      const mentees = await ctx.db.query.userMentoringData
        .findMany({
          where: (userMentoringData, { eq }) =>
            eq(
              userMentoringData.mentoringId,
              mentoringData.mentoring?.id ?? "",
            ),
          with: {
            user: {
              columns: {
                id: true,
                name: true,
                email: true,
                image: true,
                phone: true,
              },
            },
          },
          orderBy: [desc(userMentoringData.createdAt)],
        })
        .execute();

      const menteeDatas = mentees.map((data) => {
        return {
          ...data.user,
          userMentoringDataId: data.id,
        };
      });

      return menteeDatas;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something wrong on the server",
        cause: error,
      });
    }
  }),
  getOne: protectedProcedure
    .input(UserMentoringDataIdSchema)
    .query(async ({ ctx, input }) => {
      try {
        const mentees = await ctx.db.query.userMentoringData
          .findFirst({
            where: (userMentoringData, { eq }) =>
              eq(userMentoringData.id, input.mentoringDataId),
            with: {
              user: {
                columns: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                  phone: true,
                },
              },
              schedules: {
                orderBy: desc(mentoringSchedule.createdAt)
              },
            },
          })
          .execute();

        return mentees;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something wrong on the server",
          cause: error,
        });
      }
    }),
  responseSession: protectedProcedure
    .input(ResponseSessionSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { id, ...res } = input;

        const responseSchedule = await ctx.db
          .update(mentoringSchedule)
          .set({
            ...res,
          })
          .where(eq(mentoringSchedule.id, id))
          .returning();

        return responseSchedule;
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Some error occured`,
          cause: error,
        });
      }
    }),
});
