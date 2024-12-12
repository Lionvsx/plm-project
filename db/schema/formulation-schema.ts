import { InferSelectModel, relations } from "drizzle-orm";
import {
  decimal,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  varchar,
} from "drizzle-orm/pg-core";
import { product } from "./product-schema";
import { ingredient } from "./ingredient-schema";

export const formulation = pgTable("formulation", {
  id: serial("formulation_id").primaryKey(),
  productId: integer("product_id")
    .references(() => product.id)
    .notNull(),
  version: integer("version").notNull().default(1),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  notes: text("notes"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const formulationIngredient = pgTable("formulation_ingredient", {
  id: serial("formulation_ingredient_id").primaryKey(),
  formulationId: integer("formulation_id")
    .references(() => formulation.id)
    .notNull(),
  ingredientId: integer("ingredient_id")
    .references(() => ingredient.id)
    .notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
  unit: varchar("unit", { length: 50 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Formulation = InferSelectModel<typeof formulation>;
export type FormulationIngredient = InferSelectModel<
  typeof formulationIngredient
>;

export const formulationRelations = relations(formulation, ({ one, many }) => ({
  product: one(product, {
    fields: [formulation.productId],
    references: [product.id],
  }),
  ingredients: many(formulationIngredient),
}));

export const formulationIngredientRelations = relations(
  formulationIngredient,
  ({ one }) => ({
    formulation: one(formulation, {
      fields: [formulationIngredient.formulationId],
      references: [formulation.id],
    }),
    ingredient: one(ingredient, {
      fields: [formulationIngredient.ingredientId],
      references: [ingredient.id],
    }),
  })
);
