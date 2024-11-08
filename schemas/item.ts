import * as z from 'zod';

export const ItemSchema = z.object({
  quantity: z.number().int()
});
