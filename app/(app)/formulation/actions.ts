"use server";

import { createFormula as createFormulaDb } from "@/controllers/formulas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createFormula(formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    notes: formData.get("notes") as string,
    status: formData.get("status") as string,
  };

  await createFormulaDb(data);
  revalidatePath("/formulation");
  redirect("/formulation");
}

export async function updateFormula(formulaId: number, data: FormData) {
  // Implementation for updating a formula
  revalidatePath(`/formulation/${formulaId}`);
  redirect(`/formulation/${formulaId}`);
}

export async function createVariant(formulaId: number, data: FormData) {
  // Implementation for creating a new formula variant
  revalidatePath(`/formulation/${formulaId}`);
  redirect(`/formulation/${formulaId}`);
}

export async function updateVariant(
  formulaId: number,
  variantId: number,
  data: FormData
) {
  // Implementation for updating a formula variant
  revalidatePath(`/formulation/${formulaId}`);
  redirect(`/formulation/${formulaId}/variants/${variantId}`);
}

export async function deleteVariant(formulaId: number, variantId: number) {
  // Implementation for deleting a formula variant
  revalidatePath(`/formulation/${formulaId}`);
  redirect(`/formulation/${formulaId}`);
}
