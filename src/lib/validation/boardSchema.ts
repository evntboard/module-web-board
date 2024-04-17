import * as z from "zod";

export const boardSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(5),
  slug: z.string().min(5),
  description: z.string().min(5),
  image: z.string().optional(),
  color: z.string().optional(),
  width: z.number(),
  height: z.number(),
})