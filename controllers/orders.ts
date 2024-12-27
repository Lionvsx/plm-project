"use server";

import { db } from "@/db";
import { order, orderItem } from "@/db/schema/order-schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getOrders() {
  const orders = await db.query.order.findMany({
    with: {
      items: {
        with: {
          productVariant: true,
        },
      },
    },
  });
  return orders;
}

export async function getOrder(id: number) {
  const result = await db.query.order.findFirst({
    where: eq(order.id, id),
    with: {
      items: {
        with: {
          productVariant: {
            with: {
              product: true,
            },
          },
        },
      },
    },
  });
  return result;
}

export async function createOrder(data: {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  notes?: string;
  deliveryDate?: Date;
  items: {
    productVariantId: number;
    quantity: number;
    unitPrice: number;
    notes?: string;
  }[];
}) {
  const result = await db.transaction(async (tx) => {
    const [newOrder] = await tx
      .insert(order)
      .values({
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        notes: data.notes,
        deliveryDate: data.deliveryDate,
      })
      .returning();

    await tx.insert(orderItem).values(
      data.items.map((item) => ({
        orderId: newOrder.id,
        productVariantId: item.productVariantId,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toString(),
        notes: item.notes,
      }))
    );

    return newOrder;
  });

  revalidatePath("/orders");
  return result;
}
