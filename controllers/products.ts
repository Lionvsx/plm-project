"use server";

import { db } from "@/db";
import { formulation, product, productVariant } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type ProductWithVariants = {
  id: number;
  name: string;
  description: string | null;
  category: string;
  costPrice: number | null;
  margin: number | null;
  launchDate: Date | null;
  discontinuationDate: Date | null;
  variants: {
    id: number;
    size: string | null;
    sku: string | null;
    price: number | null;
  }[];
};

export async function getProducts() {
  const products = await db.query.product.findMany({
    with: {
      variants: true,
    },
  });
  return products;
}

export async function getProduct(id: number) {
  const result = await db.query.product.findFirst({
    where: eq(product.id, id),
    with: {
      variants: {
        with: {
          formulations: true,
        },
      },
    },
  });
  return result;
}

export async function createProduct(data: {
  name: string;
  description?: string;
  category: string;
  costPrice?: string;
  margin?: string;
  launchDate?: Date;
  projectId: number;
}) {
  const result = await db.insert(product).values(data).returning();
  revalidatePath("/dashboard/products");
  return result[0];
}

export async function updateProduct(
  id: number,
  data: {
    name?: string;
    description?: string;
    category?: string;
    costPrice?: string;
    margin?: string;
    launchDate?: Date;
    discontinuationDate?: Date;
  }
) {
  const result = await db
    .update(product)
    .set(data)
    .where(eq(product.id, id))
    .returning();
  revalidatePath("/dashboard/products");
  return result[0];
}

export async function deleteProduct(id: number) {
  await db.delete(product).where(eq(product.id, id));
  revalidatePath("/dashboard/products");
}

// Variant Management
export async function addProductVariant(
  productId: number,
  data: {
    size: string;
    sku: string;
    price?: string;
  }
) {
  const result = await db
    .insert(productVariant)
    .values({
      ...data,
      productId,
    })
    .returning();
  revalidatePath("/dashboard/products");
  return result[0];
}

export async function updateProductVariant(
  id: number,
  data: {
    size?: string;
    sku?: string;
    price?: string;
  }
) {
  const result = await db
    .update(productVariant)
    .set(data)
    .where(eq(productVariant.id, id))
    .returning();
  revalidatePath("/dashboard/products");
  return result[0];
}

export async function deleteProductVariant(id: number) {
  await db.delete(productVariant).where(eq(productVariant.id, id));
  revalidatePath("/dashboard/products");
}

// Cost Analysis
export async function calculateProductVariantCost(id: number) {
  const productVariantData = await db.query.productVariant.findFirst({
    where: eq(productVariant.id, id),
    with: {
      formulations: {
        where: eq(formulation.isActive, true),
        with: {
          ingredients: {
            with: {
              ingredient: true,
            },
          },
        },
      },
    },
  });

  if (!productVariantData || !productVariantData.formulations[0]) {
    return null;
  }

  const activeFormulation = productVariantData.formulations[0];
  let totalCost = 0;

  for (const formulationIngredient of activeFormulation.ingredients) {
    const ingredient = formulationIngredient.ingredient;
    const quantity = formulationIngredient.quantity;
    totalCost +=
      parseFloat(ingredient.costPerUnit || "0") * parseFloat(quantity);
  }

  return totalCost;
}

export async function getProductVariants() {
  const variants = await db.query.productVariant.findMany({
    with: {
      product: {
        columns: {
          id: true,
          name: true,
          category: true,
        },
      },
    },
  });

  console.log("Variants récupérés:", variants);

  return variants;
}
