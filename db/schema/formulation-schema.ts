import {
  decimal,
  integer,
  pgTable,
  text,
  date,
  serial,
} from "drizzle-orm/pg-core";
import { product } from "./product-schema";
import { supplier } from "./supplier-schema";

export const ingredient = pgTable("ingredient", {
  id: serial("ingredient_id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  supplierId: integer("supplier_id").references(() => supplier.id),
});

export const formula = pgTable("formula", {
  id: serial("formula_id").primaryKey(),
  productId: integer("product_id").references(() => product.id),
  version: integer("version"),
  creationDate: date("creation_date"),
  notes: text("notes"),
});

export const formulaIngredient = pgTable("formula_ingredient", {
  formulaId: integer("formula_id")
    .references(() => formula.id)
    .notNull(),
  ingredientId: integer("ingredient_id")
    .references(() => ingredient.id)
    .notNull(),
  percentage: decimal("percentage", { precision: 5, scale: 2 }),
});
