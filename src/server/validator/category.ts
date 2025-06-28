import { string, z } from "zod";

export const CategoryIdSchema = z.object({
  id: string().min(1, {
    message: "Id required",
  }),
});

export const CreateCategorySchema = z.object({
  name: z.string().min(1, {
    message: "Name required",
  }),
});

export const UpdateCategorySchema = z.object({
  name: z.string().min(1, {
    message: "Name required",
  }),
  id: string(),
});
