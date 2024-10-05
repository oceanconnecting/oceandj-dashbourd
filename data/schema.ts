import { z } from "zod"

export const taskSchema = z.object({
  title: z.string(),
  image: z.string(),
})

export type Task = z.infer<typeof taskSchema>