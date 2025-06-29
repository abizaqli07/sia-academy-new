import {
  createChapter,
  idChapter,
  updateChapter,
} from "~/server/validator/chapter";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { chapter, course, muxData } from "~/server/db/schema";
import { reorderChapter } from "~/server/validator/course";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const chapterAdminRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createChapter)
    .mutation(async ({ ctx, input }) => {
      const lastChapter = await ctx.db.query.chapter
        .findFirst({
          where: (chapter, { eq }) => eq(chapter.courseId, input.courseId),
          orderBy: (chapter, { desc }) => [desc(chapter.position)],
        })
        .execute();

      const newPosition = lastChapter ? lastChapter.position + 1 : 1;

      const createChapter = await ctx.db
        .insert(chapter)
        .values({
          ...input,
          position: newPosition,
        })
        .returning();

      return createChapter;
    }),
  update: protectedProcedure
    .input(updateChapter)
    .mutation(async ({ ctx, input }) => {
      const chapterData = await ctx.db
        .update(chapter)
        .set({
          title: input.title ?? undefined,
          description: input.description,
          videoUrl: input.videoUrl,
        })
        .where(eq(chapter.id, input.id))
        .returning();

      if (input.videoUrl) {
        const existingMuxData = await ctx.db.query.muxData
          .findFirst({
            where: (muxData, { eq }) => eq(muxData.chapterId, input.id),
          })
          .execute();

        try {
          if (existingMuxData) {
            await ctx.muxClient.video.assets.delete(existingMuxData.assetId);
            await ctx.db
              .delete(muxData)
              .where(eq(muxData.id, existingMuxData.id));
          }
        } catch (error) {
          console.log(error);
        }

        const asset = await ctx.muxClient.video.assets.create({
          inputs: [
            {
              url: input.videoUrl,
            },
          ],
          playback_policy: ["public"],
          test: false,
        });

        await ctx.db.insert(muxData).values({
          chapterId: input.id,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
        });

        return chapterData;
      }
    }),
  unpublish: protectedProcedure
    .input(idChapter)
    .mutation(async ({ ctx, input }) => {
      const unpublish = await ctx.db
        .update(chapter)
        .set({
          isPublished: false,
        })
        .where(eq(chapter.id, input.id))
        .returning();

      const publishedChapterInCourse = await ctx.db.query.chapter.findMany({
        where: (chapter, { eq }) =>
          eq(chapter.courseId, input.courseId) && eq(chapter.isPublished, true),
      });

      if (!publishedChapterInCourse.length) {
        await ctx.db
          .update(course)
          .set({
            isHidden: true,
          })
          .where(eq(course.id, input.courseId));
      }

      return unpublish;
    }),
  publish: protectedProcedure
    .input(idChapter)
    .mutation(async ({ ctx, input }) => {
      const chapterData = await ctx.db.query.chapter
        .findFirst({
          where: (chapter, { eq, and }) =>
            and(eq(chapter.id, input.id), eq(chapter.courseId, input.courseId)),
        })
        .execute();

      const muxData = await ctx.db.query.muxData.findFirst({
        where: (muxData, { eq }) => eq(muxData.chapterId, input.id),
      });

      if (
        !chapterData ||
        !muxData ||
        !chapterData.title ||
        !chapterData.description ||
        !chapterData.videoUrl
      ) {
        throw new TRPCError({
          code: "UNPROCESSABLE_CONTENT",
          message: "Missing required fields",
        });
      }

      const publish = await ctx.db
        .update(chapter)
        .set({
          isPublished: true,
        })
        .where(
          and(eq(chapter.id, input.id), eq(chapter.courseId, input.courseId)),
        )
        .returning();

      return publish;
    }),
  reorder: protectedProcedure
    .input(reorderChapter)
    .mutation(async ({ ctx, input }) => {
      try {
        for (const item of input.list) {
          await ctx.db
            .update(chapter)
            .set({
              position: item.position,
            })
            .where(eq(chapter.id, item.id));
        }

        return {
          code: "SUCCESS",
          message: "Successfully reordered",
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something wrong happened on the server",
          cause: error,
        });
      }
    }),
  delete: protectedProcedure
    .input(idChapter)
    .mutation(async ({ ctx, input }) => {
      const existed = await ctx.db.query.chapter
        .findFirst({
          where: (chapter, { eq }) => eq(chapter.id, input.id),
        })
        .execute();

      if (!existed) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chapter Not Found",
        });
      }

      if (existed.videoUrl) {
        const existingMuxData = await ctx.db.query.muxData
          .findFirst({
            where: (muxData, { eq }) => eq(muxData.chapterId, input.id),
          })
          .execute();

        if (existingMuxData) {
          await ctx.muxClient.video.assets.delete(existingMuxData.assetId);
          await ctx.db
            .delete(muxData)
            .where(eq(muxData.id, existingMuxData.id));
        }
      }

      const deletedChapter = await ctx.db
        .delete(chapter)
        .where(eq(chapter.id, input.id))
        .returning();

      const publishedChapterInCourse = await ctx.db.query.chapter.findMany({
        where: (chapter, { eq }) =>
          eq(chapter.courseId, input.courseId) && eq(chapter.isPublished, true),
      });

      if (!publishedChapterInCourse.length) {
        await ctx.db
          .update(course)
          .set({
            isHidden: true,
          })
          .where(eq(course.id, input.courseId));
      }

      return deletedChapter;
    }),
  getOne: protectedProcedure.input(idChapter).query(async ({ ctx, input }) => {
    const chapter = await ctx.db.query.chapter
      .findFirst({
        where: (chapter, { eq }) => eq(chapter.id, input.id),
        with: {
          muxData: true,
        },
      })
      .execute();

    return chapter;
  }),
});
