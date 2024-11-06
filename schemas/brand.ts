import * as z from 'zod';

export const BrandSchema = z.object({
  title: z.string().min(1, {
    message: "Brand title is required",
  }),
  image: z.string().min(1, {
    message: "Image is required",
  }),
});
