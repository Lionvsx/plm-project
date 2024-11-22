"use server";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { formulaVariant, formulaIngredient } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { VariantFormulaFormValues } from "@/lib/validators/formula-variant";

export async function getVariants() {
  const variants = await db.query.productVariant.findMany({
    with: {
      product: true,
    },
  });
  return variants;
}

export async function getVariant(id: number) {
  const variant = await db.query.formulaVariant.findFirst({
    where: eq(formulaVariant.id, id),
  });
  return variant;
}

export async function getVariantsByFormulaId(formulaId: number) {
  const variants = await db.query.formulaVariant.findMany({
    where: eq(formulaVariant.formulaId, formulaId),
  });
  return variants;
}

export async function createVariant(data: VariantFormulaFormValues) {
  const variant = await db
    .insert(formulaVariant)
    .values({
      formulaId: data.formulaId,
      name: data.name,
      version: data.version,
      notes: data.notes,
    })
    .returning();

  return variant[0];
}

export async function updateVariant(id: number, data: VariantFormulaFormValues) {
  const variant = await db
    .update(formulaVariant)
    .set({
      name: data.name,
      version: data.version,
      notes: data.notes,
    })
    .where(eq(formulaVariant.id, id))
    .returning();

  return variant[0];
}

export async function deleteVariant(id: number) {
  await db.delete(formulaVariant).where(eq(formulaVariant.id, id));
}
