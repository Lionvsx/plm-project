import { z } from "zod";

export const FormulaVariantSchema = z.object({
  id: z.number().optional(),
  formulaId: z.number(),
  version: z.number().min(1),
  notes: z.string().optional(),
});

export type FormulaVariant = z.infer<typeof FormulaVariantSchema>; 
