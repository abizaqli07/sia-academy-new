import { TRPCError } from "@trpc/server";
import { asc, desc, eq } from "drizzle-orm";
import { chapter, course } from "~/server/db/schema";
import {
  CourseIdSchema,
  CreateCourseTitleSchema,
  UpdateCourseSchema,
} from "~/server/validator/course";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const courseAdminRouter = createTRPCRouter({
  create: protectedProcedure
    .input(CreateCourseTitleSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const createCourse = await ctx.db
          .insert(course)
          .values(input)
          .returning();
        return createCourse;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Insert failed, something wrong on the server",
          cause: error,
        });
      }
    }),
  update: protectedProcedure
    .input(UpdateCourseSchema)
    .mutation(async ({ ctx, input }) => {
      const existed = await ctx.db.query.course
        .findFirst({
          where: (course, { eq }) => eq(course.id, input.id ?? ""),
        })
        .execute();

      if (!existed) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course Not Found",
        });
      }

      const { id, ...res } = input;

      const courses = await ctx.db
        .update(course)
        .set({
          ...res,
        })
        .where(eq(course.id, id ?? ""))
        .returning();

      return courses;
    }),
  unpublish: protectedProcedure
    .input(CourseIdSchema)
    .mutation(async ({ ctx, input }) => {
      const existed = await ctx.db.query.course
        .findFirst({
          where: (course, { eq }) => eq(course.id, input.courseId),
        })
        .execute();

      if (!existed) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course Not Found",
        });
      }

      const courses = await ctx.db
        .update(course)
        .set({
          isHidden: true,
        })
        .where(eq(course.id, input.courseId))
        .returning();

      return courses;
    }),
  publish: protectedProcedure
    .input(CourseIdSchema)
    .mutation(async ({ ctx, input }) => {
      const existed = await ctx.db.query.course
        .findFirst({
          where: (course, { eq }) => eq(course.id, input.courseId),
        })
        .execute();

      if (!existed) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course Not Found",
        });
      }

      const courses = await ctx.db
        .update(course)
        .set({
          isHidden: false,
        })
        .where(eq(course.id, input.courseId))
        .returning();

      return courses;
    }),
  delete: protectedProcedure
    .input(CourseIdSchema)
    .mutation(async ({ ctx, input }) => {
      const existed = await ctx.db.query.course
        .findFirst({
          where: (course, { eq }) => eq(course.id, input.courseId),
        })
        .execute();

      if (!existed) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course Not Found",
        });
      }

      const courses = await ctx.db
        .delete(course)
        .where(eq(course.id, input.courseId))
        .returning();

      return courses;
    }),
  getOne: protectedProcedure
    .input(CourseIdSchema)
    .query(async ({ ctx, input }) => {
      const courses = await ctx.db.query.course
        .findFirst({
          where: (course, { eq }) => eq(course.id, input.courseId),
          with: {
            chapters: {
              orderBy: [asc(chapter.position)],
            },
          },
        })
        .execute();

      if (!courses) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course Not Found",
        });
      }

      return courses;
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const courses = await ctx.db.query.course.findMany({
      with: {
        category: true,
        purchases: true,
      },
      orderBy: [desc(course.createdAt)],
    });

    return courses;
  }),
});
