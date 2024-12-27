import * as schema from "@/db/schema";
import { Supplier, supplier } from "@/db/schema";
import {
  formulation,
  formulationIngredient,
  type Formulation,
} from "@/db/schema/formulation-schema";
import { ingredient, type Ingredient } from "@/db/schema/ingredient-schema";
import { order, orderItem } from "@/db/schema/order-schema";
import {
  product,
  productVariant,
  type Product,
  type ProductVariant,
} from "@/db/schema/product-schema";
import { UnitType, VolumeUnit } from "@/lib/constants/units";
import { drizzle } from "drizzle-orm/node-postgres";
import { NextResponse } from "next/server";
import { Pool } from "pg";

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
        costPerUnit: "12.50",
        unitType: UnitType.VOLUME,
        unit: VolumeUnit.MILLILITER,
        stockQuantity: "1000",
        minimumStock: "200",
      },
      {
        supplierId: supplier1[0].id,
        name: "Jasmine Absolute",
        description: "Pure jasmine absolute extract",
        costPerUnit: "15.75",
        unitType: UnitType.VOLUME,
        unit: VolumeUnit.MILLILITER,
        stockQuantity: "800",
        minimumStock: "150",
      },
      {
        supplierId: supplier2[0].id,
        name: "Bergamot Oil",
        description: "Cold-pressed bergamot essential oil",
        costPerUnit: "5.25",
        unitType: UnitType.VOLUME,
        unit: VolumeUnit.MILLILITER,
        stockQuantity: "1200",
        minimumStock: "250",
      },
      {
        supplierId: supplier2[0].id,
        name: "Vanilla Extract",
        description: "Premium Madagascar vanilla extract",
        costPerUnit: "8.00",
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
  const variantPromises = products.map((prod: Product) =>
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
    ])
  );

  const variants = await Promise.all(variantPromises);
  const allVariants = variants.flat().map((v) => v[0]); // Flatten and get first item of each array

  // Create orders for 3 clients
  const orders = await db
    .insert(order)
    .values([
      {
        customerName: "Sophie Martin",
        customerEmail: "sophie.martin@email.com",
        customerPhone: "+1-555-0001",
        status: "COMPLETED",
        notes: "Regular customer - prefers quick delivery",
        deliveryDate: new Date("2024-02-20"),
      },
      {
        customerName: "David Chen",
        customerEmail: "david.chen@email.com",
        customerPhone: "+1-555-0002",
        status: "IN_PRODUCTION",
        notes: "New customer - special packaging requested",
        deliveryDate: new Date("2024-03-01"),
      },
      {
        customerName: "Maria Garcia",
        customerEmail: "maria.garcia@email.com",
        customerPhone: "+1-555-0003",
        status: "PENDING",
        notes: "Bulk order for boutique store",
        deliveryDate: new Date("2024-03-15"),
      },
    ])
    .returning();

  // Create order items
  await db.insert(orderItem).values([
    // Sophie's order - 3 items total (2 Midnight Rose 30ml + 1 Citrus Dream 30ml)
    {
      orderId: orders[0].id,
      productVariantId: allVariants[0].id, // Midnight Rose 30ml
      quantity: 2,
      unitPrice: "49.99",
      notes: "Gift wrapping needed",
    },
    {
      orderId: orders[0].id,
      productVariantId: allVariants[3].id, // Citrus Dream 30ml
      quantity: 1,
      unitPrice: "49.99",
    },
    // David's order - 1 item (Midnight Rose 50ml)
    {
      orderId: orders[1].id,
      productVariantId: allVariants[1].id, // Midnight Rose 50ml
      quantity: 1,
      unitPrice: "79.99",
      notes: "Special packaging",
    },
    // Maria's order - 10 items total (5 each of 100ml variants)
    {
      orderId: orders[2].id,
      productVariantId: allVariants[2].id, // Midnight Rose 100ml
      quantity: 5,
      unitPrice: "129.99",
      notes: "Bulk order discount applied",
    },
    {
      orderId: orders[2].id,
      productVariantId: allVariants[5].id, // Citrus Dream 100ml
      quantity: 5,
      unitPrice: "129.99",
      notes: "Bulk order discount applied",
    },
  ]);

  // Create formulations
  const formulationPromises = allVariants.map(
    async (variant: ProductVariant) => {
      const prod = products.find((p: Product) => p.id === variant.productId);
      return db
        .insert(formulation)
        .values({
          productVariantId: variant.id,
          name: `${prod?.name} ${variant.size} Formula`,
          description: "Standard formulation",
          version: 1,
          isActive: true,
        })
        .returning() as Promise<Formulation[]>;
    }
  );

  const formulations = await Promise.all(formulationPromises);

  // Create formulation ingredients
  const ingredientPromises = formulations.map(async (form: Formulation[]) => {
    const currentFormulation = form[0];
    const variant = allVariants.find(
      (v: ProductVariant) => v.id === currentFormulation.productVariantId
    );
    const prod = products.find((p: Product) => p.id === variant?.productId);
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
    await db.delete(order);
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
