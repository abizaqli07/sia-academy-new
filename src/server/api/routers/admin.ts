import { createTRPCRouter } from "../trpc";
import { categoryAdminRouter } from "./admin/category";
import { courseAdminRouter } from "./admin/course";

export const adminRouter = createTRPCRouter({
  category: categoryAdminRouter,
  course: courseAdminRouter
});