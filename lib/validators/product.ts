import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  launchDate: z.date().optional(),
  discontinuationDate: z.date().optional(),
});

export const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  costPrice: z.string(),
  margin: z.string(),
  launchDate: z.string().optional(),
  projectId: z.string(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
