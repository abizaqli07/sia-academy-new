import { desc } from "drizzle-orm";
import { mentor } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const mentorAdminRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
      const mentors = await ctx.db.query.mentor.findMany({
        with: {
          mentoring: {
            columns: {
              id: true
            }
          },
          courses: true
        },
        orderBy: [desc(mentor.createdAt)],
      });
  
      return mentors;
    }),
})