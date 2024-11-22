import { integer, pgTable, text, date, serial } from "drizzle-orm/pg-core";
import { product } from "./product-schema";
import { formula } from "./formulation-schema";

export const manufacturingBatch = pgTable("manufacturing_batch", {
  id: serial("batch_id").primaryKey(),
  productId: integer("product_id").references(() => product.id),
  formulaId: integer("formula_id").references(() => formula.id),
  productionDate: date("production_date"),
  quantity: integer("quantity"),
});

export const qualityTest = pgTable("quality_test", {
  id: serial("test_id").primaryKey(),
  batchId: integer("batch_id").references(() => manufacturingBatch.id),
  testDate: date("test_date"),
  result: text("result"),
  notes: text("notes"),
});
