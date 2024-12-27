import * as schema from "@/db/schema";
import { project, supplier } from "@/db/schema";
import {
  formulation,
  formulationIngredient,
} from "@/db/schema/formulation-schema";
import { ingredient } from "@/db/schema/ingredient-schema";
import { order, orderItem } from "@/db/schema/order-schema";
import { product, productVariant } from "@/db/schema/product-schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function dropAllTables() {
  try {
    // Delete in order of dependencies (from most dependent to least dependent)
    await db.delete(orderItem);
    await db.delete(formulationIngredient);
    await db.delete(formulation);
    await db.delete(productVariant);
    await db.delete(product);
    await db.delete(ingredient);
    await db.delete(supplier);
    await db.delete(order);
    await db.delete(project);
  } catch (error) {
    console.error("Error dropping tables:", error);
    throw error;
  }
}

export async function POST() {
  try {
    await dropAllTables();
    return NextResponse.json({ message: "Database cleared successfully" });
  } catch (error) {
    console.error("Error clearing database:", error);
    return NextResponse.json(
      { error: "Failed to clear database" },
      { status: 500 }
    );
  } finally {
    await pool.end();
  }
}
