import { z } from "zod";

export const ChapterIdSchema = z.object({
  chapterId: z.string()
})

export const createChapter = z.object({
  courseId: z.string(),
  title: z.string().min(1),
});

export const updateChapter = z.object({
  id: z.string(),
  title: z.string().nullish(),
  description: z.string().nullish(),
  videoUrl: z.string().url().nullish(),
});

export const idChapter = z.object({
  id: z.string(),
  courseId: z.string(),
});