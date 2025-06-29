import { createTRPCRouter } from "../trpc";
import { courseRouter } from "./user/course";
import { mentoringRouter } from "./user/mentoring";
import { purchaseRouter } from "./user/purchase";

export const userRouter = createTRPCRouter({
  course: courseRouter,
  mentoring: mentoringRouter,
  purchase: purchaseRouter,
});