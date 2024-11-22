import { serial, pgTable, text, integer, date } from "drizzle-orm/pg-core";
import { product, productVariant } from "./product-schema";

export const supplier = pgTable("supplier", {
  id: serial("supplier_id").primaryKey(),
  name: text("name").notNull(),
  contactInfo: text("contact_info"),
});

export const inventory = pgTable("inventory", {
  id: serial("inventory_id").primaryKey(),
  productId: serial("product_id").references(() => product.id),
  variantId: serial("variant_id").references(() => productVariant.id),
  quantity: integer("quantity"),
  lastUpdated: date("last_updated"),
});
