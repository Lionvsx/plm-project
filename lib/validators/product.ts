import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  launchDate: z.date().optional(),
  discontinuationDate: z.date().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
