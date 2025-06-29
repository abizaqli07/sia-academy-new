import { createTRPCRouter } from "../trpc";
import { categoryAdminRouter } from "./admin/category";
import { chapterAdminRouter } from "./admin/chapter";
import { courseAdminRouter } from "./admin/course";
import { mentorAdminRouter } from "./admin/mentor";

export const adminRouter = createTRPCRouter({
  category: categoryAdminRouter,
  course: courseAdminRouter,
  chapter: chapterAdminRouter,
  mentor: mentorAdminRouter
});