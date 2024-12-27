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

export const supplier = pgTable("supplier", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  contactPerson: varchar("contact_person", { length: 255 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

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

export type Supplier = InferSelectModel<typeof supplier>;
export type Ingredient = InferSelectModel<typeof ingredient>;

export const ingredientRelations = relations(ingredient, ({ one }) => ({
  supplier: one(supplier, {
    fields: [ingredient.supplierId],
    references: [supplier.id],
  }),
}));

export const supplierRelations = relations(supplier, ({ many }) => ({
  ingredients: many(ingredient),
}));
