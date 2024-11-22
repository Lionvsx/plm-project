"use server";

import { db } from "@/db";
import { inventory } from "@/db/schema/supplier-schema";
import { eq } from "drizzle-orm";

export type InventoryWithDetails = {
  id: number;
  productId: number;
  variantId: number;
  quantity: number | null;
  lastUpdated: Date | null;
  product: {
    name: string;
  };
  variant: {
    size: string;
    sku: string;
  };
};

export async function getInventoryItems() {
  const items = await db.query.inventory.findMany({
    with: {
      product: true,
      variant: true,
    },
  });

  return items;
}

export async function getInventoryItem(id: number) {
  const item = await db.query.inventory.findFirst({
    where: eq(inventory.id, id),
    with: {
      product: true,
      variant: true,
    },
  });

  return item;
}

export async function updateInventoryQuantity(id: number, quantity: number) {
  const updated = await db
    .update(inventory)
    .set({
      quantity,
      lastUpdated: new Date().toISOString(),
    })
    .where(eq(inventory.id, id))
    .returning();

  return updated[0];
}
