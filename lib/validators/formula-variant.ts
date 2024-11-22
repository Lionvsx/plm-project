import { z } from "zod";

export const formulaVariantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  version: z.number().min(1, "Version is required"),
  notes: z.string().optional(),
  formulaId: z.number(),
});

export type VariantFormulaFormValues = z.infer<typeof formulaVariantSchema>; 
