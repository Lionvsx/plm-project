import { relations } from "drizzle-orm";
import {
  timestamp,
  decimal,
  integer,
  pgEnum,
  pgTable,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { supplier } from "./supplier-schema";
import { ingredient } from "./ingredient-schema";
import { order } from "./order-schema";

export const supplierOrderStatusEnum = pgEnum("supplier_order_status", [
  "DRAFT",
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);

export const supplierOrder = pgTable("supplier_order", {
  id: integer("id").primaryKey(),
  supplierId: integer("supplier_id").notNull(),
  orderId: integer("order_id").notNull(),
  status: supplierOrderStatusEnum("status").notNull().default("DRAFT"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const supplierOrderIngredient = pgTable("supplier_order_ingredient", {
  id: integer("id").primaryKey(),
  supplierOrderId: integer("supplier_order_id").notNull(),
  ingredientId: integer("ingredient_id").notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
  unit: varchar("unit", { length: 10 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const supplierOrderRelations = relations(
  supplierOrder,
  ({ one, many }) => ({
    supplier: one(supplier, {
      fields: [supplierOrder.supplierId],
      references: [supplier.id],
    }),
    order: one(order, {
      fields: [supplierOrder.orderId],
      references: [order.id],
    }),
    ingredients: many(supplierOrderIngredient),
  })
);

export const supplierOrderIngredientRelations = relations(
  supplierOrderIngredient,
  ({ one }) => ({
    supplierOrder: one(supplierOrder, {
      fields: [supplierOrderIngredient.supplierOrderId],
      references: [supplierOrder.id],
    }),
    ingredient: one(ingredient, {
      fields: [supplierOrderIngredient.ingredientId],
      references: [ingredient.id],
    }),
  })
);
