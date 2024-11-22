"use server";

import { db } from "@/db";
import { product } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getProducts() {
  return await db.query.product.findMany({
    with: {
      variants: true,
    },
  });
}

export async function getProduct(id: number) {
  return await db.query.product.findFirst({
    where: eq(product.id, id),
    with: {
      variants: true,
    },
  });
}

export async function createProduct(data: typeof product.$inferInsert) {
  return await db.insert(product).values(data);
}

export async function updateProduct(
  id: number,
  data: Partial<typeof product.$inferInsert>
) {
  return await db.update(product).set(data).where(eq(product.id, id));
}

export async function deleteProduct(id: number) {
  return await db.delete(product).where(eq(product.id, id));
}
