import { InferSelectModel, relations } from "drizzle-orm";
import {
  date,
  decimal,
  integer,
  pgTable,
  serial,
  text,
} from "drizzle-orm/pg-core";

export const product = pgTable("product", {
  id: serial("product_id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  launchDate: date("launch_date", { mode: "date" }),
  discontinuationDate: date("discontinuation_date", { mode: "date" }),
});

export type Product = InferSelectModel<typeof product>;

export const productVariant = pgTable("product_variant", {
  id: serial("variant_id").primaryKey(),
  productId: integer("product_id").references(() => product.id),
  size: text("size"),
  sku: text("sku").unique(),
  price: decimal("price", { precision: 10, scale: 2 }),
});

export type ProductVariant = InferSelectModel<typeof productVariant>;

export const productRelations = relations(product, ({ many }) => ({
  variants: many(productVariant),
}));

export const productVariantRelations = relations(productVariant, ({ one }) => ({
  product: one(product, {
    fields: [productVariant.productId],
    references: [product.id],
  }),
}));
