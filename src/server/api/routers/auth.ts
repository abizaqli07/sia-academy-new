import { TRPCError } from "@trpc/server";
import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { mentor, users } from "~/server/db/schema";
import {
  ChangePasswordSchema,
  RegisterMentorSchema,
  RegisterSchema,
  UpdateDataSchema,
} from "~/server/validator/auth";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(RegisterSchema)
    .mutation(async ({ input, ctx }) => {
      const haveUser = await ctx.db.query.users
        .findFirst({
          where: (users, { eq }) => eq(users.email, input.email),
        })
        .execute();

      if (haveUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exist",
        });
      }

      const hashed = await hash(input.password, 10);

      const user = await ctx.db
        .insert(users)
        .values({
          email: input.email,
          password: hashed,
          name: input.name,
        })
        .returning();

      return user;
    }),
  registerMentor: publicProcedure
    .input(RegisterMentorSchema)
    .mutation(async ({ ctx, input }) => {
      const haveUser = await ctx.db.query.users
        .findFirst({
          where: (users, { eq }) => eq(users.email, input.email),
        })
        .execute();

      if (haveUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User with this email already exist",
        });
      }

      const hashed = await hash(input.password, 10);

      try {
        const user = await ctx.db
          .insert(users)
          .values({
            email: input.email,
            password: hashed,
            name: input.name,
            role: "MENTOR",
          })
          .returning();

        const mentorData = await ctx.db
          .insert(mentor)
          .values({
            name: input.name,
            desc: input.desc,
            expertise: input.expertise,
            title: input.title,
            company: input.company,
            industry: input.industry,
            userId: user[0]?.id,
          })
          .returning();

        return mentorData;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something wrong happened on the server",
          cause: error,
        });
      }
    }),
  getUserData: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user.id;

    try {
      const userData = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, userId),
      });

      return userData;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something wrong on the server",
        cause: error,
      });
    }
  }),
  updateUserData: protectedProcedure
    .input(UpdateDataSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user.id;

      const user = await ctx.db
        .update(users)
        .set({
          email: input.email,
          name: input.name,
          phone: input.phone,
          notifConsent: input.notifConsent,
          image: input.image,
        })
        .where(eq(users.id, userId))
        .returning();

      return user;
    }),
  changePassword: protectedProcedure
    .input(ChangePasswordSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user.id;

      const userData = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, userId),
      });

      if (!userData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User tidak ditemukan",
        });
      }

      const hashed = await hash(input.password, 10);

      const passwordMatch = await compare(
        input.oldPassword,
        userData.password ?? "",
      );

      if (!passwordMatch) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Password lama yang anda masukkan salah",
        });
      }

      try {
        const user = await ctx.db
          .update(users)
          .set({
            password: hashed,
          })
          .where(eq(users.id, userId))
          .returning();

        return user;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Some error occured, please try again",
          cause: error,
        });
      }
    }),
});
