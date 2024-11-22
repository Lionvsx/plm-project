import {
  decimal,
  integer,
  pgTable,
  text,
  serial,
} from "drizzle-orm/pg-core";
import { supplier } from "./supplier-schema";
import { relations } from "drizzle-orm";

export const ingredient = pgTable("ingredient", {
  id: serial("ingredient_id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  supplierId: integer("supplier_id").references(() => supplier.id),
});

export const formula = pgTable("formula", {
  id: serial("formula_id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  notes: text("notes"),
});

export const formulaIngredient = pgTable("formula_ingredient", {
  variantId: integer("formula_variant_id")
    .references(() => formulaVariant.id)
    .notNull(),
  ingredientId: integer("ingredient_id")
    .references(() => ingredient.id)
    .notNull(),
  percentage: decimal("percentage", { precision: 5, scale: 2 }),
});

export const formulaVariant = pgTable("formula_variant", {
  id: serial("formula_variant_id").primaryKey(),
  formulaId: integer("formula_id").references(() => formula.id),
  name: text("name").notNull(),
  version: integer("version"),
  notes: text("notes"),
});

export const ingredientRelations = relations(ingredient, ({ one, many }) => ({
  supplier: one(supplier, {
    fields: [ingredient.supplierId],
    references: [supplier.id],
  }),
  formulas: many(formulaIngredient),
}));

export const formulaRelations = relations(formula, ({ many }) => ({
  variants: many(formulaVariant),
}));


export const formulaVariantRelations = relations(formulaVariant, ({ one, many }) => ({
  formula: one(formula, {
    fields: [formulaVariant.formulaId],
    references: [formula.id],
  }),
    ingredients: many(formulaIngredient),
  })
);

export const formulaIngredientRelations = relations(
  formulaIngredient,
  ({ one }) => ({
    variant: one(formulaVariant, {
      fields: [formulaIngredient.variantId],
      references: [formulaVariant.id],
    }),
    ingredient: one(ingredient, {
      fields: [formulaIngredient.ingredientId],
      references: [ingredient.id],
    }),
  })
);
