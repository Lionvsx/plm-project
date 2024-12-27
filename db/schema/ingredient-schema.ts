import { InferSelectModel, relations } from "drizzle-orm";
import {
  decimal,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { UnitType } from "@/lib/constants/units";
import { supplier } from "./supplier-schema";

export const ingredient = pgTable("ingredient", {
  id: serial("ingredient_id").primaryKey(),
  supplierId: integer("supplier_id").references(() => supplier.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  costPerUnit: decimal("cost_per_unit", { precision: 10, scale: 2 }).notNull(),
  unitType: varchar("unit_type", { length: 50 }).notNull().$type<UnitType>(),
  unit: varchar("unit", { length: 50 }).notNull(),
  stockQuantity: decimal("stock_quantity", { precision: 10, scale: 2 }).default(
    "0"
  ),
  minimumStock: decimal("minimum_stock", { precision: 10, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Ingredient = InferSelectModel<typeof ingredient>;

export const ingredientRelations = relations(ingredient, ({ one }) => ({
  supplier: one(supplier, {
    fields: [ingredient.supplierId],
    references: [supplier.id],
  }),
}));
