import { desc } from "drizzle-orm";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc";
import {
  mentoring,
  mentoringSchedule,
  userMentoringData,
} from "~/server/db/schema";
import {
  MentoringIdSchema,
  RegisterUserDataMentoringSchema,
  RequestSessionSchema,
  UserMentoringDataIdSchema,
} from "~/server/validator/mentoring";
import { TRPCError } from "@trpc/server";

export const mentoringRouter = createTRPCRouter({
  getFeaturedMentoring: publicProcedure.query(async ({ ctx }) => {
    const featuredMentoring = await ctx.db.query.mentoring.findMany({
      where: (mentoring, { eq }) => eq(mentoring.isFeatured, true),
      with: {
        category: true,
        mentor: true,
      },
      orderBy: [desc(mentoring.createdAt)],
    });

    return featuredMentoring;
  }),
  getAllMentoring: protectedProcedure.query(async ({ ctx }) => {
    const allMentoring = await ctx.db.query.mentoring.findMany({
      with: {
        category: true,
        mentor: true,
      },
      orderBy: [desc(mentoring.createdAt)],
    });

    return allMentoring;
  }),
  getOneMentoring: protectedProcedure
    .input(MentoringIdSchema)
    .query(async ({ input, ctx }) => {
      const detailMentoring = await ctx.db.query.mentoring.findFirst({
        where: (mentoring, { eq }) => eq(mentoring.id, input.mentoringId),
        with: {
          category: true,
          mentor: true,
        },
      });

      return detailMentoring;
    }),
  inputUserMentoringData: protectedProcedure
    .input(RegisterUserDataMentoringSchema)
    .mutation(async ({ input, ctx }) => {
      const mentoring = await ctx.db.query.mentoring.findFirst({
        where: (mentoring, { eq }) => eq(mentoring.id, input.mentoringId),
      });

      if (mentoring === undefined) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Mentoring Not Found",
        });
      }

      try {
        const insertUserData = await ctx.db
          .insert(userMentoringData)
          .values({
            userId: ctx.session.user.id,
            mentoringId: input.mentoringId,
            objective: input.objective,
            preference: input.preference,
            positionPreference: input.positionPreference,
            referral: input.referral,
            cv: input.cv,
          })
          .onConflictDoUpdate({
            target: [userMentoringData.userId, userMentoringData.mentoringId],
            set: {
              objective: input.objective,
              preference: input.preference,
              positionPreference: input.positionPreference,
              referral: input.referral,
              cv: input.cv,
            },
          })
          .returning();

        return insertUserData;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Some error occured`,
          cause: error,
        });
      }
    }),
  getAllMyMentoring: protectedProcedure.query(async ({ ctx }) => {
    const purchases = await ctx.db.query.purchase
      .findMany({
        where: (purchase, { eq, and, isNotNull }) =>
          and(
            eq(purchase.userId, ctx.session?.user.id),
            isNotNull(purchase.mentoringId),
          ),
        with: {
          mentoring: {
            with: {
              mentoring: {
                with: {
                  mentor: true,
                },
              },
            },
          },
        },
      })
      .execute();

    return purchases;
  }),
  requestSession: protectedProcedure
    .input(RequestSessionSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const requestSchedule = await ctx.db
          .insert(mentoringSchedule)
          .values({
            userMentoringDataId: input.mentoringDataId,
            date: input.date,
          })
          .returning();

        return requestSchedule;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Some error occured`,
          cause: error,
        });
      }
    }),
  getRecentSession: protectedProcedure
    .input(UserMentoringDataIdSchema)
    .query(async ({ ctx, input }) => {
      const mentoringSession = await ctx.db.query.userMentoringData.findFirst({
        where: (userMentoringData, { eq }) =>
          eq(userMentoringData.id, input.mentoringDataId),
        with: {
          schedules: {
            limit: 1,
            orderBy: [desc(mentoringSchedule.createdAt)],
          },
        },
      });

      return mentoringSession;
    }),
});
