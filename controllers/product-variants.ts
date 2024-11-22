"use server";

import { db } from "@/db";
import { productVariant } from "@/db/schema/product-schema";
import { eq } from "drizzle-orm";
import { VariantFormValues } from "@/lib/validators/variant";

export async function getVariants() {
  const variants = await db.query.productVariant.findMany({
    with: {
      product: true,
    }
  });
  return variants;
}

export async function getVariant(id: number) {
  const variant = await db.query.productVariant.findFirst({
    where: eq(productVariant.id, id),
  });
  return variant;
}

export async function getVariantsByProductId(productId: number) {
  const variants = await db.query.productVariant.findMany({
    where: eq(productVariant.productId, productId),
  });
  return variants;
}

export async function createVariant(data: VariantFormValues) {
  const variant = await db
    .insert(productVariant)
    .values({
      productId: data.productId,
      size: data.size,
      sku: data.sku,
      price: data.price,
    })
    .returning();

  return variant[0];
}

export async function updateVariant(id: number, data: VariantFormValues) {
  const variant = await db
    .update(productVariant)
    .set({
      size: data.size,
      sku: data.sku,
      price: data.price,
    })
    .where(eq(productVariant.id, id))
    .returning();

  return variant[0];
}

export async function deleteVariant(id: number) {
  await db.delete(productVariant).where(eq(productVariant.id, id));
}
