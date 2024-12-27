import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/db/schema";
import {
  ingredient,
  supplier,
  type Ingredient,
  type Supplier,
} from "@/db/schema/ingredient-schema";
import {
  product,
  productVariant,
  type Product,
  type ProductVariant,
} from "@/db/schema/product-schema";
import {
  formulation,
  formulationIngredient,
  type Formulation,
} from "@/db/schema/formulation-schema";
import { orderItem } from "@/db/schema/order-schema";
import { UnitType, VolumeUnit, WeightUnit } from "@/lib/constants/units";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function seedDatabase() {
  // Create suppliers
  const suppliers = (await Promise.all([
    db
      .insert(supplier)
      .values({
        name: "Fragrance Essentials Co.",
        contactPerson: "John Smith",
        email: "john@fragranceessentials.com",
        phone: "+1-555-0123",
        address: "123 Perfume Lane, New York, NY 10001",
      })
      .returning() as Promise<Supplier[]>,
    db
      .insert(supplier)
      .values({
        name: "Natural Scents Ltd.",
        contactPerson: "Emma Johnson",
        email: "emma@naturalscents.com",
        phone: "+1-555-0124",
        address: "456 Aroma Street, Los Angeles, CA 90001",
      })
      .returning() as Promise<Supplier[]>,
  ])) as [Supplier[], Supplier[]];

  const [supplier1, supplier2] = suppliers;

  // Create ingredients
  const ingredients = (await db
    .insert(ingredient)
    .values([
      {
        supplierId: supplier1[0].id,
        name: "Rose Essential Oil",
        description: "Premium rose essential oil from Bulgaria",
        costPerUnit: "120.50",
        unitType: UnitType.VOLUME,
        unit: VolumeUnit.MILLILITER,
        stockQuantity: "1000",
        minimumStock: "200",
      },
      {
        supplierId: supplier1[0].id,
        name: "Jasmine Absolute",
        description: "Pure jasmine absolute extract",
        costPerUnit: "180.75",
        unitType: UnitType.VOLUME,
        unit: VolumeUnit.MILLILITER,
        stockQuantity: "800",
        minimumStock: "150",
      },
      {
        supplierId: supplier2[0].id,
        name: "Bergamot Oil",
        description: "Cold-pressed bergamot essential oil",
        costPerUnit: "85.25",
        unitType: UnitType.VOLUME,
        unit: VolumeUnit.MILLILITER,
        stockQuantity: "1200",
        minimumStock: "250",
      },
      {
        supplierId: supplier2[0].id,
        name: "Vanilla Extract",
        description: "Premium Madagascar vanilla extract",
        costPerUnit: "95.00",
        unitType: UnitType.VOLUME,
        unit: VolumeUnit.MILLILITER,
        stockQuantity: "900",
        minimumStock: "200",
      },
    ])
    .returning()) as unknown as Ingredient[];

  // Create products
  const products = (await db
    .insert(product)
    .values([
      {
        name: "Midnight Rose",
        description: "A luxurious floral fragrance with deep rose notes",
        category: "Eau de Parfum",
        launchDate: new Date("2024-01-15"),
      },
      {
        name: "Citrus Dream",
        description: "Fresh and vibrant citrus blend with bergamot",
        category: "Eau de Toilette",
        launchDate: new Date("2024-02-01"),
      },
    ])
    .returning()) as unknown as Product[];

  // Create product variants
  const variantPromises = products.map(
    (prod: Product) =>
      Promise.all([
        db
          .insert(productVariant)
          .values({
            productId: prod.id,
            size: "30ml",
            sku: `${prod.name.substring(0, 3).toUpperCase()}-30`,
            price: "49.99",
          })
          .returning(),
        db
          .insert(productVariant)
          .values({
            productId: prod.id,
            size: "50ml",
            sku: `${prod.name.substring(0, 3).toUpperCase()}-50`,
            price: "79.99",
          })
          .returning(),
        db
          .insert(productVariant)
          .values({
            productId: prod.id,
            size: "100ml",
            sku: `${prod.name.substring(0, 3).toUpperCase()}-100`,
            price: "129.99",
          })
          .returning(),
      ]) as Promise<[ProductVariant[], ProductVariant[], ProductVariant[]]>
  );

  const variants = await Promise.all(variantPromises);

  // Create formulations
  const formulationPromises = variants
    .flat()
    .map(async (variant: ProductVariant[]) => {
      const productVariant = variant[0];
      const prod = products.find(
        (p: Product) => p.id === productVariant.productId
      );
      return db
        .insert(formulation)
        .values({
          productVariantId: productVariant.id,
          name: `${prod?.name} ${productVariant.size} Formula`,
          description: "Standard formulation",
          version: 1,
          isActive: true,
        })
        .returning() as Promise<Formulation[]>;
    });

  const formulations = await Promise.all(formulationPromises);

  // Create formulation ingredients
  const ingredientPromises = formulations.map(async (form: Formulation[]) => {
    const currentFormulation = form[0];
    const variant = variants
      .flat()
      .find(
        (v: ProductVariant[]) => v[0].id === currentFormulation.productVariantId
      );
    const prod =
      variant && products.find((p: Product) => p.id === variant[0].productId);
    const isRose = prod?.name === "Midnight Rose";

    return db.insert(formulationIngredient).values([
      {
        formulationId: currentFormulation.id,
        ingredientId: ingredients[isRose ? 0 : 2].id,
        quantity: "20.00",
        unit: VolumeUnit.MILLILITER,
        notes: "Base note",
      },
      {
        formulationId: currentFormulation.id,
        ingredientId: ingredients[isRose ? 1 : 3].id,
        quantity: "15.00",
        unit: VolumeUnit.MILLILITER,
        notes: "Heart note",
      },
    ]);
  });

  await Promise.all(ingredientPromises);
}

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
    await seedDatabase();
    return NextResponse.json({ message: "Database seeded successfully" });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  } finally {
    await pool.end();
  }
}
