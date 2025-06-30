import { createSchemaFactory } from "drizzle-zod";
import { z } from "zod";
import { mentor, mentoring, mentoringSchedule } from "../db/schema";

const { createUpdateSchema } = createSchemaFactory({
  coerce: {
    date: true,
  },
});

export const MentoringIdSchema = z.object({
  mentoringId: z.string(),
});

export const UserMentoringDataIdSchema = z.object({
  mentoringDataId: z.string(),
});

export const RegisterUserDataMentoringSchema = z.object({
  objective: z
    .string()
    .min(1, { message: "Objective required for registering" }),
  preference: z.string(),
  positionPreference: z.string(),
  referral: z.string(),
  cv: z.string().min(1, { message: "CV required for registering" }),
  mentoringId: z.string(),
});

export const RegisterMentoringSchema = z.object({
  title: z.string().min(1, {
    message: "Required",
  }),
  desc: z.string().min(1, {
    message: "Required",
  }),
  materi: z.string().min(1, {
    message: "Required",
  }),
  categoryId: z.string().min(1, {
    message: "Required",
  }),
  price: z.string(),
});

export const UpdateMentoringSchema = createUpdateSchema(mentoring);
export const UpdateMentoringAltSchema = createUpdateSchema(mentoring, {
  desc: z.string(),
  materi: z.string(),
});

export const UpdateMentorSchema = createUpdateSchema(mentor);
export const UpdateMentorAltSchema = createUpdateSchema(mentor, {
  name: z.string(),
  company: z.string(),
  desc: z.string(),
  expertise: z.string(),
  industry: z.string(),
  title: z.string(),
  linkedin: z.string(),
});

export const RequestSessionSchema = z.object({
  mentoringDataId: z.string().min(1, {
    message: "Required",
  }),
  date: z.date(),
});

export const ResponseSessionSchema = createUpdateSchema(mentoringSchedule, {
  message: z.string(),
  id: z.string(),
});
