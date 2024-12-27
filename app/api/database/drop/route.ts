import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/db/schema";
import { orderItem } from "@/db/schema/order-schema";
import {
  formulationIngredient,
  formulation,
} from "@/db/schema/formulation-schema";
import { productVariant, product } from "@/db/schema/product-schema";
import { ingredient, supplier } from "@/db/schema/ingredient-schema";

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
