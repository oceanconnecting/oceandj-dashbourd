import * as z from 'zod';

export const CategorySchema = z.object({
  title: z.string().min(1, {
    message: "Category title is required",
  }),
  image: z.string().min(1, {
    message: "Image is required",
  }),
  typeId: z.string()
});
