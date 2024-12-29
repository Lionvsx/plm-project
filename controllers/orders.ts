"use server";

import { db } from "@/db";
import { order, orderItem } from "@/db/schema/order-schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { desc } from "drizzle-orm";

export async function getOrders() {
  const orders = await db.query.order.findMany({
    with: {
      items: {
        with: {
          productVariant: true,
        },
      },
    },
    orderBy: (orders) => [desc(orders.deliveryDate)],
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
  status?: string;
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
        status: data.status as any,
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

export async function updateOrder(id: number, data: any) {
  try {
    const updatedOrder = await db.transaction(async (tx) => {
      // Update the main order
      const [updatedOrder] = await tx
        .update(order)
        .set({
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          status: data.status,
          notes: data.notes,
          deliveryDate: data.deliveryDate,
          updatedAt: new Date(),
        })
        .where(eq(order.id, id))
        .returning();

      if (!updatedOrder) {
        throw new Error("Order not found");
      }

      // Delete existing items
      await tx.delete(orderItem).where(eq(orderItem.orderId, id));

      // Insert new items
      const items = await Promise.all(
        data.items.map((item: any) =>
          tx
            .insert(orderItem)
            .values({
              orderId: id,
              productVariantId: item.productVariantId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              notes: item.notes,
            })
            .returning()
        )
      );

      return {
        ...updatedOrder,
        items: items.map((i) => i[0]),
      };
    });

    revalidatePath("/orders");
    return updatedOrder;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
}
