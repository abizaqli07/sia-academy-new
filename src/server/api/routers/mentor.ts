import { createTRPCRouter } from "../trpc";
import { menteeRouter } from "./mentor/mentee";
import { mentoringRouter } from "./mentor/mentoring";

export const mentorRouter = createTRPCRouter({
  mentoring: mentoringRouter,
  mentee: menteeRouter
});