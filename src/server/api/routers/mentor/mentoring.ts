import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { category, mentor, mentoring } from "~/server/db/schema";
import {
  MentoringIdSchema,
  RegisterMentoringSchema,
  UpdateMentoringSchema,
  UpdateMentorSchema,
} from "~/server/validator/mentoring";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const mentoringRouter = createTRPCRouter({
  registerMentoring: protectedProcedure
    .input(RegisterMentoringSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const mentorData = await ctx.db.query.mentor.findFirst({
          where: (mentor, { eq }) => eq(mentor.userId, ctx.session.user.id),
        });

        if (!mentorData) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Mentor data not found, cannot register for mentoring",
          });
        }

        const register = await ctx.db
          .insert(mentoring)
          .values({
            title: input.title,
            desc: input.desc,
            materi: input.materi,
            categoryId: input.categoryId,
            price: input.price,
            mentorId: mentorData.id,
            isFeatured: true,
          })
          .returning();

        return register;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something wrong happened on the server",
          cause: error,
        });
      }
    }),
  update: protectedProcedure
    .input(UpdateMentoringSchema)
    .mutation(async ({ ctx, input }) => {
      const existed = await ctx.db.query.mentoring
        .findFirst({
          where: (mentoring, { eq }) => eq(mentoring.id, input.id ?? ""),
        })
        .execute();

      if (!existed) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Mentoring Not Found",
        });
      }

      const { id, ...res } = input;

      const mentorings = await ctx.db
        .update(mentoring)
        .set({
          ...res,
        })
        .where(eq(mentoring.id, id ?? ""))
        .returning();

      return mentorings;
    }),
  updateMentor: protectedProcedure
    .input(UpdateMentorSchema)
    .mutation(async ({ ctx, input }) => {
      const existed = await ctx.db.query.mentor
        .findFirst({
          where: (mentor, { eq }) => eq(mentor.id, input.id ?? ""),
        })
        .execute();

      if (!existed) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Mentor Not Found",
        });
      }

      const { id, ...res } = input;

      const mentorings = await ctx.db
        .update(mentor)
        .set({
          ...res,
        })
        .where(eq(mentor.id, id ?? ""))
        .returning();

      return mentorings;
    }),
  unpublish: protectedProcedure
    .input(MentoringIdSchema)
    .mutation(async ({ ctx, input }) => {
      const existed = await ctx.db.query.mentoring
        .findFirst({
          where: (mentoring, { eq }) => eq(mentoring.id, input.mentoringId),
        })
        .execute();

      if (!existed) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Mentoring Not Found",
        });
      }

      const mentorings = await ctx.db
        .update(mentoring)
        .set({
          isHidden: true,
        })
        .where(eq(mentoring.id, input.mentoringId))
        .returning();

      return mentorings;
    }),
  publish: protectedProcedure
    .input(MentoringIdSchema)
    .mutation(async ({ ctx, input }) => {
      const existed = await ctx.db.query.mentoring
        .findFirst({
          where: (mentoring, { eq }) => eq(mentoring.id, input.mentoringId),
        })
        .execute();

      if (!existed) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Mentoring Not Found",
        });
      }

      const mentorings = await ctx.db
        .update(mentoring)
        .set({
          isHidden: false,
        })
        .where(eq(mentoring.id, input.mentoringId))
        .returning();

      return mentorings;
    }),
  delete: protectedProcedure
    .input(MentoringIdSchema)
    .mutation(async ({ ctx, input }) => {
      const existed = await ctx.db.query.mentoring
        .findFirst({
          where: (mentoring, { eq }) => eq(mentoring.id, input.mentoringId),
        })
        .execute();

      if (!existed) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Mentoring Not Found",
        });
      }

      const mentorings = await ctx.db
        .delete(mentoring)
        .where(eq(mentoring.id, input.mentoringId))
        .returning();

      return mentorings;
    }),
  getCategory: protectedProcedure.query(async ({ ctx }) => {
    try {
      const categories = await ctx.db.query.category.findMany({
        orderBy: [desc(category.name)],
      });

      return categories;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something wrong on the server",
        cause: error,
      });
    }
  }),
  getData: protectedProcedure.query(async ({ ctx }) => {
    try {
      const mentoringData = await ctx.db.query.mentor.findFirst({
        where: (mentor, { eq }) => eq(mentor.userId, ctx.session.user.id),
        with: {
          mentoring: true,
        },
      });

      return mentoringData;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something wrong happened on the server",
        cause: error,
      });
    }
  }),
});
