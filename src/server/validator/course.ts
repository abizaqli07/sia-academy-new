import { z } from "zod";
import { createUpdateSchema } from 'drizzle-zod';
import { course } from "../db/schema";

export const CourseIdSchema = z.object({
  courseId: z.string(),
});

export const CreateCourseTitleSchema = z.object({
  title: z.string().min(1, {
    message: "Title required",
  }),
  categoryId: z.string().min(1, {
    message: "Category required"
  }),
  isWebinar: z.boolean(),
});

export const CreateCourseSchema = z.object({
  title: z.string().min(1, {
    message: "Required",
  }),
  titleDesc: z.string().min(1, {
    message: "Required",
  }),
  desc: z.string().min(1, {
    message: "Required",
  }),
  image: z.string().min(1, {
    message: "Required",
  }),
  bannerImage: z.string().min(1, {
    message: "Required",
  }),
  materi: z.string().min(1, {
    message: "Required",
  }),
  place: z.string().min(1, {
    message: "Required",
  }),
  placeUrl: z.string().url(),
  price: z.number(),
  salePrice: z.number(),
  date: z.string().min(1, {
    message: "Required",
  }),
  isFeatured: z.boolean(),
  isFree: z.boolean(),
  isHidden: z.boolean(),
  isSale: z.boolean(),
  isWebinar: z.boolean(),
  requireProofment: z.boolean(),
  categoryId: z.string().min(1, {
    message: "Required",
  }),
});

export const UpdateCourseSchema = createUpdateSchema(course, {
  id: z.string()
});
export const UpdateCourseAltSchema = createUpdateSchema(course, {
  id: z.string(),
  titleDesc: z.string(),
  desc: z.string(),
  materi: z.string(),
  place: z.string(),
  placeUrl: z.string().url(),
  price: z.string().min(4, {message: "Price not valid"}),
});

export const idCourse = z.object({
  id: z.string().uuid(),
});

export const reorderChapter = z.object({
  courseId: z.string().uuid(),
  list: z.array(
    z.object({
      id: z.string().uuid(),
      position: z.number(),
    }),
  ),
});
