import * as z from 'zod';

export const TypeSchema = z.object({
  title: z.string().min(1, {
    message: "Type title is required",
  }),
  image: z.string().min(1, {
    message: "Image is required",
  }),
});
