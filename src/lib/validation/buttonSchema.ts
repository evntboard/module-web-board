import * as z from "zod";

export const buttonSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(5).optional(),
  text: z.string(),
  type: z.string(),
  color: z.string().optional(),
  image: z.string().optional(),
  row_end: z.number(),
  row_start: z.number(),
  column_end: z.number(),
  column_start: z.number(),
})