import {
  decimal,
  integer,
  pgTable,
  text,
  date,
  serial,
} from "drizzle-orm/pg-core";

export const product = pgTable("product", {
  id: serial("product_id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  launchDate: date("launch_date"),
  discontinuationDate: date("discontinuation_date"),
});

export const productVariant = pgTable("product_variant", {
  id: serial("variant_id").primaryKey(),
  productId: integer("product_id").references(() => product.id),
  size: text("size"),
  sku: text("sku").unique(),
  price: decimal("price", { precision: 10, scale: 2 }),
});
