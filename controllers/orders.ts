"use server";

import { db } from "@/db";
import { order, orderItem } from "@/db/schema/order-schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { desc, sql } from "drizzle-orm";
import { formulation } from "@/db/schema/formulation-schema";
import { ingredient } from "@/db/schema/ingredient-schema";

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

export type OrderIngredientNeeds = {
  ingredientId: number;
  name: string;
  totalQuantity: number;
  unit: string;
  availableStock: number;
  minimumStock: number;
  isStockCritical: boolean;
  supplierId?: number | null;
};

export async function calculateOrderIngredientNeeds(
  orderId: number
): Promise<OrderIngredientNeeds[]> {
  // Get the order with its items and their product variants
  const orderDetails = await db.query.order.findFirst({
    where: eq(order.id, orderId),
    with: {
      items: {
        with: {
          productVariant: {
            with: {
              formulations: {
                where: eq(formulation.isActive, true),
                with: {
                  ingredients: {
                    with: {
                      ingredient: {
                        with: {
                          supplier: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!orderDetails) throw new Error("Order not found");

  // Calculate needs for each ingredient
  const needs: Map<number, OrderIngredientNeeds> = new Map();

  for (const item of orderDetails.items) {
    const activeFormulation = item.productVariant?.formulations?.[0];
    if (!activeFormulation) continue;

    for (const formulaIngredient of activeFormulation.ingredients) {
      const { ingredient, quantity, unit } = formulaIngredient;
      const totalQuantity = parseFloat(quantity) * item.quantity;

      const existingNeed = needs.get(ingredient.id);
      if (existingNeed) {
        existingNeed.totalQuantity += totalQuantity;
        existingNeed.isStockCritical =
          existingNeed.totalQuantity > existingNeed.availableStock;
      } else {
        const availableStock = parseFloat(
          ingredient.stockQuantity?.toString() || "0"
        );
        const minimumStock = parseFloat(
          ingredient.minimumStock?.toString() || "0"
        );
        needs.set(ingredient.id, {
          ingredientId: ingredient.id,
          name: ingredient.name,
          totalQuantity,
          unit,
          availableStock,
          minimumStock,
          isStockCritical: totalQuantity > availableStock,
          supplierId: ingredient.supplier?.id || null,
        });
      }
    }
  }

  return Array.from(needs.values());
}

export async function updateOrder(id: number, data: any) {
  try {
    // If status is changing to IN_PRODUCTION, calculate ingredient needs first
    const currentOrder = await getOrder(id);
    if (
      currentOrder?.status !== "IN_PRODUCTION" &&
      data.status === "IN_PRODUCTION"
    ) {
      const needs = await calculateOrderIngredientNeeds(id);
      const criticalIngredients = needs.filter((need) => need.isStockCritical);

      if (criticalIngredients.length > 0) {
        throw new Error(
          "Insufficient stock for ingredients: " +
            criticalIngredients
              .map(
                (ing) =>
                  `${ing.name} (needs: ${ing.totalQuantity} ${ing.unit}, available: ${ing.availableStock} ${ing.unit})`
              )
              .join(", ")
        );
      }
    }

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

      // If status is IN_PRODUCTION, update ingredient stocks
      if (data.status === "IN_PRODUCTION") {
        const needs = await calculateOrderIngredientNeeds(id);
        for (const need of needs) {
          await tx
            .update(ingredient)
            .set({
              stockQuantity: sql`${ingredient.stockQuantity} - ${need.totalQuantity}`,
              updatedAt: new Date(),
            })
            .where(eq(ingredient.id, need.ingredientId));
        }
      }

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
