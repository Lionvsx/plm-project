import { product } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  launchDate: z.date().optional(),
  discontinuationDate: z.date().optional(),
});

export const insertProductSchema = createInsertSchema(product);

export type ProductFormValues = z.infer<typeof productSchema>;
