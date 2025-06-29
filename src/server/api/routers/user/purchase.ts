import { CourseIdSchema } from "~/server/validator/course";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";
import { type CreateInvoiceRequest } from "xendit-node/invoice/models";
import { getBaseProductionUrl } from "~/lib/get-base-url";
import { purchase, userMentoringData } from "~/server/db/schema";
import { RegisterUserDataMentoringSchema } from "~/server/validator/mentoring";
import { GetInvoiceDataSchema } from "~/server/validator/purchase";

export const purchaseRouter = createTRPCRouter({
  purchaseCourse: protectedProcedure
    .input(CourseIdSchema)
    .mutation(async ({ input, ctx }) => {
      const course = await ctx.db.query.course.findFirst({
        where: (course, { eq }) => eq(course.id, input.courseId),
      });

      if (course === undefined) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course Not Found",
        });
      }

      const userId = ctx.session.user.id;

      const alreadyBuy = await ctx.db.query.purchase
        .findFirst({
          where: (purchase, { and, eq }) =>
            and(
              eq(purchase.courseId, input.courseId),
              eq(purchase.userId, userId),
            ),
        })
        .execute();

      if (alreadyBuy !== undefined) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You already buy this course",
        });
      }

      const DateId = +new Date();

      const data: CreateInvoiceRequest = {
        externalId: course.id,
        payerEmail: ctx.session?.user.email ?? "",
        description: `Purchasing Course ${course.title}`,
        currency: "IDR",
        amount: Number(course.isSale ? course.salePrice : course.price),
        successRedirectUrl: `${getBaseProductionUrl()}/dashboard/user/my_course`,
        items: [
          {
            name: course.title,
            price: Number(course.isSale ? course.salePrice : course.price),
            quantity: 1,
          },
        ],
      };

      if (course.isFree) {
        try {
          await ctx.db
            .insert(purchase)
            .values({
              userId: ctx.session.user.id,
              courseId: course.id,
              status: "FREE",
              invoiceId: String(DateId),
              invoiceUrl: "",
            })
            .returning();

          return {
            url: `${getBaseProductionUrl()}/dashboard/user/my_course`,
            error: null,
          };
        } catch (error) {
          return {
            url: null,
            error: error,
          };
        }
      } else {
        try {
          const invoice = await ctx.xnd.Invoice.createInvoice({
            data,
          });

          await ctx.db
            .insert(purchase)
            .values({
              userId: ctx.session.user.id,
              courseId: course.id,
              invoiceId: invoice.id,
              invoiceUrl: invoice.invoiceUrl,
            })
            .returning();

          return {
            url: invoice.invoiceUrl,
            error: null,
          };
        } catch (error) {
          return {
            url: null,
            error: error,
          };
        }
      }
    }),
  purchaseMentoring: protectedProcedure
    .input(RegisterUserDataMentoringSchema)
    .mutation(async ({ input, ctx }) => {
      const mentoring = await ctx.db.query.mentoring.findFirst({
        where: (mentoring, { eq }) => eq(mentoring.id, input.mentoringId),
      });

      if (mentoring === undefined) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Mentoring Not Found",
        });
      }

      if (
        ctx.session === null ||
        ctx.session.user.email === null ||
        ctx.session.user.id === undefined
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This Method for User Only",
        });
      }

      const userId = ctx.session.user.id;

      const alreadyBuy = await ctx.db.query.purchase
        .findFirst({
          where: (purchase, { and, eq }) =>
            and(
              eq(purchase.mentoringId, input.mentoringId),
              eq(purchase.userId, userId),
            ),
        })
        .execute();

      if (alreadyBuy !== undefined) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You already buy this mentoring",
        });
      }

      const DateId = +new Date();

      const data: CreateInvoiceRequest = {
        externalId: `${ctx.session.user.id}${mentoring.id}${DateId}`,
        payerEmail: ctx.session?.user.email,
        description: `Purchasing mentoring ${mentoring.title}`,
        currency: "IDR",
        amount: Number(mentoring.price),
        successRedirectUrl: `${getBaseProductionUrl()}/dashboard/user/my_mentoring`,
        items: [
          {
            name: mentoring.title,
            price: Number(mentoring.price),
            quantity: 1,
          },
        ],
      };

      try {
        const invoice = await ctx.xnd.Invoice.createInvoice({
          data,
        });

        const insertUserData = await ctx.db
          .insert(userMentoringData)
          .values({
            userId: ctx.session.user.id,
            mentoringId: input.mentoringId,
            objective: input.objective,
            preference: input.preference,
            positionPreference: input.positionPreference,
            referral: input.referral,
            cv: input.cv,
          })
          .onConflictDoUpdate({
            target: [userMentoringData.userId, userMentoringData.mentoringId],
            set: {
              objective: input.objective,
              preference: input.preference,
              positionPreference: input.positionPreference,
              referral: input.referral,
              cv: input.cv,
            },
          })
          .returning();

        if (insertUserData) {
          await ctx.db
            .insert(purchase)
            .values({
              userId: ctx.session.user.id,
              mentoringId: insertUserData[0]?.id,
              invoiceId: invoice.id,
              invoiceUrl: invoice.invoiceUrl,
            })
            .returning();
        }

        return {
          url: invoice.invoiceUrl,
          error: null,
        };
      } catch (error) {
        return {
          url: null,
          error: error,
        };
      }
    }),
  getInvoiceData: protectedProcedure
    .input(GetInvoiceDataSchema)
    .query(async ({ ctx, input }) => {
      const invoice = await ctx.db.query.purchase.findFirst({
        where: (purchase, { eq }) => eq(purchase.invoiceId, input.invoiceId),
      });

      if (invoice?.status === "FREE") {
        return null;
      } else {
        const invoiceData = await ctx.xnd.Invoice.getInvoiceById({
          invoiceId: input.invoiceId ?? "",
        });

        return invoiceData;
      }
    }),
});
