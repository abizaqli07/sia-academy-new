import { asc, desc } from "drizzle-orm";
import { chapter, course } from "~/server/db/schema";
import { ChapterIdSchema } from "~/server/validator/chapter";
import { CourseIdSchema } from "~/server/validator/course";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc";

export const courseRouter = createTRPCRouter({
  getFeaturedCourse: publicProcedure.query(async ({ ctx }) => {
    const bootcamps = await ctx.db.query.course.findMany({
      where: (course, { eq, and }) =>
        and(eq(course.isFeatured, true), eq(course.isHidden, false)),
      with: {
        category: true,
        purchases: true,
      },
      orderBy: [desc(course.createdAt)],
    });

    return bootcamps;
  }),
  getAllCourse: protectedProcedure.query(async ({ ctx }) => {
    const courses = await ctx.db.query.course.findMany({
      where: (course, { eq }) => eq(course.isHidden, false),
      with: {
        category: true,
        purchases: true,
      },
      orderBy: [desc(course.createdAt)],
    });

    return courses;
  }),
  getOneCourse: publicProcedure
    .input(CourseIdSchema)
    .query(async ({ input, ctx }) => {
      const bootcamps = await ctx.db.query.course.findFirst({
        where: (course, { eq }) => eq(course.id, input.courseId),
        with: {
          category: true,
          mentors: {
            with: {
              mentor: true,
            },
          },
        },
      });

      return bootcamps;
    }),
  getAllMyCourse: protectedProcedure.query(async ({ ctx }) => {
    const courses = await ctx.db.query.purchase
      .findMany({
        where: (purchase, { eq, and, isNotNull }) =>
          and(
            eq(purchase.userId, ctx.session.user.id),
            isNotNull(purchase.courseId),
          ),
        with: {
          course: {
            with: {
              category: true,
            },
          },
        },
      })
      .execute();

    return courses;
  }),
  getOneMyCourse: protectedProcedure
    .input(CourseIdSchema)
    .query(async ({ input, ctx }) => {
      const bootcamps = await ctx.db.query.course.findFirst({
        where: (course, { eq }) => eq(course.id, input.courseId),
        with: {
          chapters: {
            where: (chapter, { eq }) => eq(chapter.isPublished, true),
            orderBy: [asc(chapter.position)],
          },
        },
      });

      return bootcamps;
    }),
  getOneChapter: protectedProcedure
    .input(ChapterIdSchema)
    .query(async ({ input, ctx }) => {
      const chapters = await ctx.db.query.chapter.findFirst({
        where: (chapter, { eq }) => eq(chapter.id, input.chapterId),
        with: {
          muxData: true,
        },
      });

      return chapters;
    }),
});
