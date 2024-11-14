import { z } from 'zod';

export const OrderSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.string().email({
    message: "Email must be a valid email address",
  }).min(1, {
    message: "Email is required",
  }),
  phone: z.string().min(1, {
    message: "Phone is required",
  }),
  address: z.string().min(1, {
    message: "Address is required",
  }),
  products: z.array(z.object({
    id: z.string(),
    quantity: z.number().min(1)
  })).min(1, {
    message: "At least one product is required",
  }),
});
