"use server";

import { db } from "@/db";
import { ingredient, supplier } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type IngredientWithSupplier = {
  id: number;
  name: string;
  description: string | null;
  costPerUnit: string;
  unit: string;
  stockQuantity: string;
  minimumStock: string | null;
  notes: string | null;
  supplier: {
    id: number;
    name: string;
    contactPerson: string | null;
    email: string | null;
    phone: string | null;
  } | null;
};

// Ingredient Management
export async function getIngredients() {
  const ingredients = await db.query.ingredient.findMany({
    with: {
      supplier: true,
    },
  });
  return ingredients;
}

export async function getIngredient(id: number) {
  const result = await db.query.ingredient.findFirst({
    where: eq(ingredient.id, id),
    with: {
      supplier: true,
    },
  });
  return result;
}

export async function createIngredient(data: {
  name: string;
  description?: string;
  supplierId?: number;
  costPerUnit: string;
  unit: string;
  stockQuantity?: string;
  minimumStock?: string;
  notes?: string;
}) {
  const result = await db.insert(ingredient).values(data).returning();
  revalidatePath("/dashboard/ingredients");
  return result[0];
}

export async function updateIngredient(
  id: number,
  data: {
    name?: string;
    description?: string;
    supplierId?: number;
    costPerUnit?: string;
    unit?: string;
    stockQuantity?: string;
    minimumStock?: string;
    notes?: string;
  }
) {
  const result = await db
    .update(ingredient)
    .set(data)
    .where(eq(ingredient.id, id))
    .returning();
  revalidatePath("/dashboard/ingredients");
  return result[0];
}

export async function deleteIngredient(id: number) {
  await db.delete(ingredient).where(eq(ingredient.id, id));
  revalidatePath("/dashboard/ingredients");
}

// Stock Management
export async function updateStock(id: number, quantity: string) {
  const result = await db
    .update(ingredient)
    .set({
      stockQuantity: quantity,
      updatedAt: new Date(),
    })
    .where(eq(ingredient.id, id))
    .returning();
  revalidatePath("/dashboard/ingredients");
  return result[0];
}

export async function getLowStockIngredients() {
  const ingredients = await db.query.ingredient.findMany({
    where: (fields, { and, lte, isNotNull }) =>
      and(
        isNotNull(fields.minimumStock),
        lte(fields.stockQuantity, fields.minimumStock)
      ),
    with: {
      supplier: true,
    },
  });
  return ingredients;
}

// Supplier Management
export async function getSuppliers() {
  const suppliers = await db.query.supplier.findMany({
    with: {
      ingredients: true,
    },
  });
  return suppliers;
}

export async function getSupplier(id: number) {
  const result = await db.query.supplier.findFirst({
    where: eq(supplier.id, id),
    with: {
      ingredients: true,
    },
  });
  return result;
}

export async function createSupplier(data: {
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
}) {
  const result = await db.insert(supplier).values(data).returning();
  revalidatePath("/dashboard/suppliers");
  return result[0];
}

export async function updateSupplier(
  id: number,
  data: {
    name?: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    address?: string;
  }
) {
  const result = await db
    .update(supplier)
    .set(data)
    .where(eq(supplier.id, id))
    .returning();
  revalidatePath("/dashboard/suppliers");
  return result[0];
}

export async function deleteSupplier(id: number) {
  await db.delete(supplier).where(eq(supplier.id, id));
  revalidatePath("/dashboard/suppliers");
}
