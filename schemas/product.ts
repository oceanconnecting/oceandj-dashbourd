import { z } from 'zod';

export const ProductSchema = z.object({
  title: z.string(),
  description: z.string(),
  images: z.array(z.string()), // Updated to an array of strings
  price: z.number().nonnegative(),
  discount: z.number().optional(), // Discount is optional
  stock: z.number().int().nonnegative(),
  categoryId: z.number().int(),
});
