"use server";

import { db } from "@/db";
import { productVariant } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getProductVariants() {
  return await db.query.productVariant.findMany({
    with: {
      product: true,
    },
  });
}

export async function getProductVariant(id: string) {
  return await db.query.productVariant.findFirst({
    where: eq(productVariant.id, Number(id)),
    with: {
      product: true,
    },
  });
}

export async function getVariantsByProductId(productId: string) {
  return await db.query.productVariant.findMany({
    where: eq(productVariant.productId, Number(productId)),
    with: {
      product: true,
    },
  });
}

export async function createProductVariant(
  data: typeof productVariant.$inferInsert
) {
  return await db.insert(productVariant).values(data);
}

export async function updateProductVariant(
  id: string,
  data: Partial<typeof productVariant.$inferInsert>
) {
  return await db
    .update(productVariant)
    .set(data)
    .where(eq(productVariant.id, Number(id)));
}

export async function deleteProductVariant(id: string) {
  return await db
    .delete(productVariant)
    .where(eq(productVariant.id, Number(id)));
}
