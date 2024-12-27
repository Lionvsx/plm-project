import { z } from "zod";

export const orderItemSchema = z.object({
  productVariantId: z.coerce.number().min(1, "Product variant is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  notes: z.string().optional(),
});

export const orderSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email().optional().or(z.literal("")),
  customerPhone: z.string().optional(),
  notes: z.string().optional(),
  deliveryDate: z.string().optional(),
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
});
