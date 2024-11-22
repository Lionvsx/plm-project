import { z } from "zod";

export const variantSchema = z.object({
  size: z.string().min(1, "Size is required"),
  sku: z.string().min(1, "SKU is required"),
  price: z.string().min(1, "Price is required"),
  productId: z.number(),
});

export type VariantFormValues = z.infer<typeof variantSchema>;
