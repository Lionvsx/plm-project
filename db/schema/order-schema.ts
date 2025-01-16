import { InferSelectModel, relations } from "drizzle-orm";
import {
  decimal,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { productVariant } from "./product-schema";

// Enum pour le statut de la commande
export const orderStatusEnum = pgEnum("order_status", [
  "PENDING",
  "IN_PRODUCTION",
  "COMPLETED",
  "CANCELLED",
]);

// Table principale des commandes
export const order = pgTable("order", {
  id: serial("order_id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  status: orderStatusEnum("status").default("PENDING").notNull(),
  notes: text("notes"),
  deliveryDate: timestamp("delivery_date", { mode: "date" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Table de liaison pour les produits dans la commande
export const orderItem = pgTable("order_item", {
  id: serial("order_item_id").primaryKey(),
  orderId: integer("order_id")
    .references(() => order.id)
    .notNull(),
  productVariantId: integer("product_variant_id")
    .references(() => productVariant.id)
    .notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
});

// Types
export type Order = InferSelectModel<typeof order>;
export type OrderItem = InferSelectModel<typeof orderItem>;

// Relations
export const orderRelations = relations(order, ({ many }) => ({
  items: many(orderItem),
}));

export const orderItemRelations = relations(orderItem, ({ one }) => ({
  order: one(order, {
    fields: [orderItem.orderId],
    references: [order.id],
  }),
  productVariant: one(productVariant, {
    fields: [orderItem.productVariantId],
    references: [productVariant.id],
  }),
}));
