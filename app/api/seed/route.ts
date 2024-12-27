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
import { UnitType, VolumeUnit, PieceUnit } from "@/lib/constants/units";
import { drizzle } from "drizzle-orm/node-postgres";
import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function seedDatabase() {
  // Create suppliers
  const [supplier1, supplier2, supplier3, supplier4, supplier5] =
    (await Promise.all([
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
      db
        .insert(supplier)
        .values({
          name: "Base Materials Inc.",
          contactPerson: "Michael Brown",
          email: "michael@basematerials.com",
          phone: "+1-555-0125",
          address: "789 Chemical Road, Chicago, IL 60601",
        })
        .returning() as Promise<Supplier[]>,
      db
        .insert(supplier)
        .values({
          name: "Premium Packaging Co.",
          contactPerson: "Sarah Wilson",
          email: "sarah@premiumpackaging.com",
          phone: "+1-555-0126",
          address: "321 Box Street, Miami, FL 33101",
        })
        .returning() as Promise<Supplier[]>,
      db
        .insert(supplier)
        .values({
          name: "Luxury Containers Ltd.",
          contactPerson: "David Lee",
          email: "david@luxurycontainers.com",
          phone: "+1-555-0127",
          address: "654 Glass Avenue, Seattle, WA 98101",
        })
        .returning() as Promise<Supplier[]>,
    ])) as [Supplier[], Supplier[], Supplier[], Supplier[], Supplier[]];

  // Create ingredients
  const ingredients = (await db
    .insert(ingredient)
    .values([
      {
        supplierId: supplier1[0].id,
        name: "Rose Essential Oil",
        description: "Premium rose essential oil from Bulgaria",
        costPerUnit: "4.50",
        unitType: UnitType.VOLUME,
        unit: VolumeUnit.MILLILITER,
        stockQuantity: "1000",
        minimumStock: "200",
      },
      {
        supplierId: supplier1[0].id,
        name: "Jasmine Absolute",
        description: "Pure jasmine absolute extract",
        costPerUnit: "3.75",
        unitType: UnitType.VOLUME,
        unit: VolumeUnit.MILLILITER,
        stockQuantity: "800",
        minimumStock: "150",
      },
      {
        supplierId: supplier2[0].id,
        name: "Bergamot Oil",
        description: "Cold-pressed bergamot essential oil",
        costPerUnit: "1.25",
        unitType: UnitType.VOLUME,
        unit: VolumeUnit.MILLILITER,
        stockQuantity: "1200",
        minimumStock: "250",
      },
      {
        supplierId: supplier2[0].id,
        name: "Vanilla Extract",
        description: "Premium Madagascar vanilla extract",
        costPerUnit: "2.00",
        unitType: UnitType.VOLUME,
        unit: VolumeUnit.MILLILITER,
        stockQuantity: "900",
        minimumStock: "200",
      },
      {
        supplierId: supplier3[0].id,
        name: "Perfumer's Alcohol",
        description: "Pure ethanol base for perfumes",
        costPerUnit: "0.50",
        unitType: UnitType.VOLUME,
        unit: VolumeUnit.MILLILITER,
        stockQuantity: "5000",
        minimumStock: "1000",
      },
      {
        supplierId: supplier3[0].id,
        name: "Fixative Base",
        description: "Helps scent last longer",
        costPerUnit: "1.20",
        unitType: UnitType.VOLUME,
        unit: VolumeUnit.MILLILITER,
        stockQuantity: "2000",
        minimumStock: "400",
      },
      {
        supplierId: supplier4[0].id,
        name: "Luxury Glass Bottle 50mL",
        description: "High-quality clear glass bottle",
        costPerUnit: "4.50",
        unitType: UnitType.PIECE,
        unit: PieceUnit.PIECE,
        stockQuantity: "1000",
        minimumStock: "200",
      },
      {
        supplierId: supplier4[0].id,
        name: "Premium Glass Bottle 50mL",
        description: "Standard glass bottle",
        costPerUnit: "3.20",
        unitType: UnitType.PIECE,
        unit: PieceUnit.PIECE,
        stockQuantity: "1500",
        minimumStock: "300",
      },
      {
        supplierId: supplier4[0].id,
        name: "Metal Spray Pump Gold",
        description: "Gold-plated spray pump",
        costPerUnit: "2.80",
        unitType: UnitType.PIECE,
        unit: PieceUnit.PIECE,
        stockQuantity: "1000",
        minimumStock: "200",
      },
      {
        supplierId: supplier4[0].id,
        name: "Metal Spray Pump Silver",
        description: "Silver-plated spray pump",
        costPerUnit: "2.20",
        unitType: UnitType.PIECE,
        unit: PieceUnit.PIECE,
        stockQuantity: "1500",
        minimumStock: "300",
      },
      {
        supplierId: supplier5[0].id,
        name: "Luxury Box",
        description: "Premium packaging box with silk lining",
        costPerUnit: "3.50",
        unitType: UnitType.PIECE,
        unit: PieceUnit.PIECE,
        stockQuantity: "1000",
        minimumStock: "200",
      },
      {
        supplierId: supplier5[0].id,
        name: "Standard Box",
        description: "Standard cardboard packaging box",
        costPerUnit: "1.80",
        unitType: UnitType.PIECE,
        unit: PieceUnit.PIECE,
        stockQuantity: "2000",
        minimumStock: "400",
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
  const variantPromises = products.map((prod: Product) => {
    const prices =
      prod.name === "Midnight Rose"
        ? ["49.99", "73.99", "139.99"] // Midnight Rose: 30ml, 50ml, 100ml
        : ["34.99", "49.99", "89.99"]; // Citrus Dream: 30ml, 50ml, 100ml

    return Promise.all([
      db
        .insert(productVariant)
        .values({
          productId: prod.id,
          size: "30ml",
          sku: `${prod.name.substring(0, 3).toUpperCase()}-30`,
          price: prices[0],
        })
        .returning(),
      db
        .insert(productVariant)
        .values({
          productId: prod.id,
          size: "50ml",
          sku: `${prod.name.substring(0, 3).toUpperCase()}-50`,
          price: prices[1],
        })
        .returning(),
      db
        .insert(productVariant)
        .values({
          productId: prod.id,
          size: "100ml",
          sku: `${prod.name.substring(0, 3).toUpperCase()}-100`,
          price: prices[2],
        })
        .returning(),
    ]);
  });

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
    const size = parseInt(variant?.size?.replace("ml", "") || "0");

    // Calculate quantities based on bottle size
    const alcoholQuantity = (size * 0.8).toFixed(2); // 80% alcohol
    const fixativeQuantity = (size * 0.03).toFixed(2); // 3% fixative
    const mainEssenceQuantity = (size * 0.12).toFixed(2); // 12% main essence
    const secondaryEssenceQuantity = (size * 0.05).toFixed(2); // 5% secondary essence

    return db.insert(formulationIngredient).values([
      // Perfumer's Alcohol (80%)
      {
        formulationId: currentFormulation.id,
        ingredientId: ingredients[4].id, // Perfumer's Alcohol
        quantity: alcoholQuantity,
        unit: VolumeUnit.MILLILITER,
        notes: "Base solvent",
      },
      // Fixative (3%)
      {
        formulationId: currentFormulation.id,
        ingredientId: ingredients[5].id, // Fixative Base
        quantity: fixativeQuantity,
        unit: VolumeUnit.MILLILITER,
        notes: "Enhances longevity",
      },
      // Main Essence (12%)
      {
        formulationId: currentFormulation.id,
        ingredientId: ingredients[isRose ? 0 : 2].id, // Rose Oil or Bergamot Oil
        quantity: mainEssenceQuantity,
        unit: VolumeUnit.MILLILITER,
        notes: isRose ? "Main rose note" : "Main citrus note",
      },
      // Secondary Essence (5%)
      {
        formulationId: currentFormulation.id,
        ingredientId: ingredients[isRose ? 1 : 3].id, // Jasmine or Vanilla
        quantity: secondaryEssenceQuantity,
        unit: VolumeUnit.MILLILITER,
        notes: isRose ? "Supporting jasmine note" : "Vanilla base note",
      },
      // Packaging components
      {
        formulationId: currentFormulation.id,
        ingredientId:
          size === 30
            ? ingredients[7].id
            : size === 50
            ? ingredients[7].id
            : ingredients[6].id, // Select bottle based on size
        quantity: "1",
        unit: PieceUnit.PIECE,
        notes: "Glass bottle",
      },
      {
        formulationId: currentFormulation.id,
        ingredientId:
          size === 30 || size === 50 ? ingredients[9].id : ingredients[8].id, // Silver pump for smaller sizes, gold for 100ml
        quantity: "1",
        unit: PieceUnit.PIECE,
        notes: "Spray pump",
      },
      {
        formulationId: currentFormulation.id,
        ingredientId: size === 100 ? ingredients[10].id : ingredients[11].id, // Luxury box for 100ml, standard for others
        quantity: "1",
        unit: PieceUnit.PIECE,
        notes: "Packaging box",
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
