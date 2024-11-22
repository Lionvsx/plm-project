import * as z from "zod"

export const formulaSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  notes: z.string().optional(),
})

export type FormulaFormValues = z.infer<typeof formulaSchema> 