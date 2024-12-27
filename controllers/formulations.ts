"use server";

import { db } from "@/db";
import { formulation, formulationIngredient } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type FormulationWithDetails = {
  id: number;
  productId: number;
  version: number;
  name: string;
  description: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  product: {
    name: string;
    category: string;
  };
  ingredients: {
    id: number;
    quantity: number;
    unit: string;
    notes: string | null;
    ingredient: {
      name: string;
      costPerUnit: number;
      unit: string;
    };
  }[];
};

export async function getFormulations() {
  const formulations = await db.query.formulation.findMany({
    with: {
      product: true,
      ingredients: {
        with: {
          ingredient: true,
        },
      },
    },
  });
  return formulations;
}

export async function getFormulation(id: number) {
  const result = await db.query.formulation.findFirst({
    where: eq(formulation.id, id),
    with: {
      product: true,
      ingredients: {
        with: {
          ingredient: true,
        },
      },
    },
  });
  return result;
}

export async function createFormulation(data: {
  productVariantId: number;
  name: string;
  description?: string;
  notes?: string;
  version?: number;
}) {
  const result = await db.insert(formulation).values(data).returning();
  revalidatePath("/dashboard/formulations");
  return result[0];
}

export async function updateFormulation(
  id: number,
  data: {
    name?: string;
    description?: string;
    notes?: string;
    isActive?: boolean;
  }
) {
  const result = await db
    .update(formulation)
    .set(data)
    .where(eq(formulation.id, id))
    .returning();
  revalidatePath("/dashboard/formulations");
  return result[0];
}

export async function deleteFormulation(id: number) {
  await db.delete(formulation).where(eq(formulation.id, id));
  revalidatePath("/dashboard/formulations");
}

// Ingredient Management
export async function addFormulationIngredient(
  formulationId: number,
  data: {
    ingredientId: number;
    quantity: string;
    unit: string;
    notes?: string;
  }
) {
  const result = await db
    .insert(formulationIngredient)
    .values({
      ...data,
      formulationId,
    })
    .returning();
  revalidatePath("/dashboard/formulations");
  return result[0];
}

export async function updateFormulationIngredient(
  id: number,
  data: {
    quantity: string;
    unit: string;
    notes?: string | null;
  }
) {
  const result = await db
    .update(formulationIngredient)
    .set(data)
    .where(eq(formulationIngredient.id, id))
    .returning();
  revalidatePath("/products");
  return result[0];
}

export async function deleteFormulationIngredient(id: number) {
  await db
    .delete(formulationIngredient)
    .where(eq(formulationIngredient.id, id));
  revalidatePath("/dashboard/formulations");
}

// Version Management
export async function createNewVersion(formulationId: number) {
  const currentFormulation = await getFormulation(formulationId);
  if (!currentFormulation) return null;

  // Create new formulation with incremented version
  const newFormulation = await createFormulation({
    productVariantId: currentFormulation.productVariantId,
    name: currentFormulation.name,
    description: currentFormulation.description ?? undefined,
    notes: currentFormulation.notes ?? undefined,
    version: (currentFormulation.version || 0) + 1,
  });

  // Copy all ingredients to new formulation
  for (const ingredient of currentFormulation.ingredients) {
    await addFormulationIngredient(newFormulation.id, {
      ingredientId: ingredient.ingredient.id,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      notes: ingredient.notes ?? undefined,
    });
  }

  // Deactivate old formulation
  await updateFormulation(formulationId, { isActive: false });

  return newFormulation;
}
