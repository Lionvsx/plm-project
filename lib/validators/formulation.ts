import * as z from "zod";

export const formulationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  version: z.coerce.number().min(1, "Version is required"),
  productVariantId: z.number().min(1, "Product Variant ID is required"),
  notes: z.string().optional(),
});
