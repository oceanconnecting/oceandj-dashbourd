import { z } from 'zod';

export const ProductSchema = z.object({
  title: z.string(),
  description: z.string(),
  images: z.array(z.string()),
  price: z.number().int().nonnegative(),
  discount: z.number().optional(),
  stock: z.number().int().nonnegative(),
  categoryId: z.number().int(),
});
