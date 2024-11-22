import * as z from "zod";

export const formulationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  productId: z.number(),
  version: z.number().optional(),
  creationDate: z.date().optional(),
  revisionDate: z.date().optional(),
  notes: z.string().optional(),
});

export type FormulationSchema = z.infer<typeof formulationSchema>;
