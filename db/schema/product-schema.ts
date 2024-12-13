import { InferSelectModel, relations } from "drizzle-orm";
import {
  date,
  decimal,
  integer,
  pgTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { formulation } from "./formulation-schema";
import { project } from "./project-schema";

export const product = pgTable("product", {
  id: serial("product_id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  projectId: integer("projectId").references(() => project.id),
  category: varchar("category", { length: 50 }).notNull(),
  costPrice: decimal("cost_price", { precision: 10, scale: 2 }),
  margin: decimal("margin", { precision: 5, scale: 2 }),
  launchDate: date("launch_date", { mode: "date" }),
  discontinuationDate: date("discontinuation_date", { mode: "date" }),
});

export type Product = InferSelectModel<typeof product>;

export const productVariant = pgTable("product_variant", {
  // Internal IDs
  id: serial("variant_id").primaryKey(),
  productId: integer("product_id").references(() => product.id),
  // PROPS
  size: text("size"),
  sku: text("sku").unique(),
  price: decimal("price", { precision: 10, scale: 2 }),
});

export type ProductVariant = InferSelectModel<typeof productVariant>;

export const productRelations = relations(product, ({ many, one }) => ({
  variants: many(productVariant),
  project: one(project, {
    fields: [product.projectId],
    references: [project.id],
  }),
}));

export const productVariantRelations = relations(
  productVariant,
  ({ one, many }) => ({
    product: one(product, {
      fields: [productVariant.productId],
      references: [product.id],
    }),
    formulations: many(formulation),
  })
);
