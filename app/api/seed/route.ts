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
  const [
    supplier1,
    supplier2,
    supplier3,
    supplier4,
    supplier5,
    supplier6,
    supplier7,
  ] = (await Promise.all([
    db
      .insert(supplier)
      .values({
        name: "Fragrance Essentials Co.",
        email: "john@fragranceessentials.com",
        phone: "+1-555-0123",
        address: "123 Perfume Lane, New York, NY 10001",
      })
      .returning(),
    db
      .insert(supplier)
      .values({
        name: "Natural Scents Ltd.",
        email: "emma@naturalscents.com",
        phone: "+1-555-0124",
        address: "456 Aroma Street, Los Angeles, CA 90001",
      })
      .returning(),
    db
      .insert(supplier)
      .values({
        name: "Base Materials Inc.",
        email: "michael@basematerials.com",
        phone: "+1-555-0125",
        address: "789 Chemical Road, Chicago, IL 60601",
      })
      .returning(),
    db
      .insert(supplier)
      .values({
        name: "Premium Packaging Co.",
        email: "sarah@premiumpackaging.com",
        phone: "+1-555-0126",
        address: "321 Box Street, Miami, FL 33101",
      })
      .returning(),
    db
      .insert(supplier)
      .values({
        name: "Luxury Containers Ltd.",
        email: "david@luxurycontainers.com",
        phone: "+1-555-0127",
        address: "654 Glass Avenue, Seattle, WA 98101",
      })
      .returning(),
    db
      .insert(supplier)
      .values({
        name: "Oriental Essences Co.",
        email: "ali@orientalessences.com",
        phone: "+1-555-0128",
        address: "789 Spice Road, Dubai",
      })
      .returning(),
    db
      .insert(supplier)
      .values({
        name: "Marine Fragrances Inc.",
        email: "marie@marinefragrances.com",
        phone: "+1-555-0129",
        address: "456 Ocean Drive, Miami, FL 33139",
      })
      .returning(),
  ])) as [
    Supplier[],
    Supplier[],
    Supplier[],
    Supplier[],
    Supplier[],
    Supplier[],
    Supplier[]
  ];

  // Create ingredients
  const ingredients = await db
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
      {
        supplierId: supplier1[0].id,
        name: "Ylang Ylang Essential Oil",
        description: "Exotic floral oil from Madagascar",
        costPerUnit: "3.20",
        unitType: UnitType.VOLUME,
        unit: VolumeUnit.MILLILITER,
        stockQuantity: "800",
        minimumStock: "150",
      },
      {
        supplierId: supplier2[0].id,
        name: "Orange Essential Oil",
        description: "Sweet orange essential oil",
        costPerUnit: "1.00",
        unitType: UnitType.VOLUME,
        unit: VolumeUnit.MILLILITER,
        stockQuantity: "1200",
        minimumStock: "250",
      },
      {
        supplierId: supplier2[0].id,
        name: "Lemon Essential Oil",
        description: "Fresh lemon essential oil",
        costPerUnit: "0.90",
        unitType: UnitType.VOLUME,
        unit: VolumeUnit.MILLILITER,
        stockQuantity: "1200",
        minimumStock: "250",
      },
      {
        supplierId: supplier6[0].id,
        name: "Oud Oil",
        description: "Premium agarwood oil",
        costPerUnit: "15.00",
        unitType: UnitType.VOLUME,
        unit: VolumeUnit.MILLILITER,
        stockQuantity: "500",
        minimumStock: "100",
      },
      {
        supplierId: supplier6[0].id,
        name: "Amber Resin",
        description: "Warm amber resin",
        costPerUnit: "4.00",
        unitType: UnitType.VOLUME,
        unit: VolumeUnit.MILLILITER,
        stockQuantity: "800",
        minimumStock: "150",
      },
      {
        supplierId: supplier6[0].id,
        name: "Sandalwood Oil",
        description: "Indian sandalwood essential oil",
        costPerUnit: "8.00",
        unitType: UnitType.VOLUME,
        unit: VolumeUnit.MILLILITER,
        stockQuantity: "600",
        minimumStock: "120",
      },
      {
        supplierId: supplier7[0].id,
        name: "Marine Accord",
        description: "Fresh oceanic scent",
        costPerUnit: "2.50",
        unitType: UnitType.VOLUME,
        unit: VolumeUnit.MILLILITER,
        stockQuantity: "1000",
        minimumStock: "200",
      },
      {
        supplierId: supplier7[0].id,
        name: "Sea Salt Accord",
        description: "Salty marine note",
        costPerUnit: "1.80",
        unitType: UnitType.VOLUME,
        unit: VolumeUnit.MILLILITER,
        stockQuantity: "1000",
        minimumStock: "200",
      },
      {
        supplierId: supplier7[0].id,
        name: "Rain Accord",
        description: "Fresh rain scent",
        costPerUnit: "2.20",
        unitType: UnitType.VOLUME,
        unit: VolumeUnit.MILLILITER,
        stockQuantity: "1000",
        minimumStock: "200",
      },
    ])
    .returning();

  // Create products
  const products = await db
    .insert(product)
    .values([
      {
        name: "Imperium",
        description:
          "A majestic oriental woody fragrance combining rare Indian oud, Australian sandalwood, and golden amber, enriched with exotic spices and precious resins",
        category: "Parfum",
        launchDate: new Date("2025-03-15"),
      },
      {
        name: "Horizon",
        description:
          "A sophisticated marine fragrance blending fresh sea spray, mineral accords, and coastal sage, enhanced with crystalline musks and driftwood",
        category: "Eau de Toilette",
        launchDate: new Date("2025-04-15"),
      },
    ])
    .returning();

  // Create product variants with appropriate pricing
  const variantPromises = products.map((prod) => {
    let prices: string[];
    switch (prod.name) {
      case "Imperium":
        prices = ["129.99", "189.99", "249.99", "349.99", "449.99"]; // Premium oriental woody
        break;
      case "Horizon":
        prices = ["69.99", "99.99", "149.99", "199.99", "249.99"]; // Fresh aquatic
        break;
      default:
        prices = ["69.99", "99.99", "149.99", "199.99", "249.99"]; // Default pricing
    }

    return Promise.all([
      db
        .insert(productVariant)
        .values({
          productId: prod.id,
          size: "15ml",
          sku: `${prod.name.substring(0, 3).toUpperCase()}-15`,
          price: prices[0],
        })
        .returning(),
      db
        .insert(productVariant)
        .values({
          productId: prod.id,
          size: "30ml",
          sku: `${prod.name.substring(0, 3).toUpperCase()}-30`,
          price: prices[1],
        })
        .returning(),
      db
        .insert(productVariant)
        .values({
          productId: prod.id,
          size: "50ml",
          sku: `${prod.name.substring(0, 3).toUpperCase()}-50`,
          price: prices[2],
        })
        .returning(),
      db
        .insert(productVariant)
        .values({
          productId: prod.id,
          size: "75ml",
          sku: `${prod.name.substring(0, 3).toUpperCase()}-75`,
          price: prices[3],
        })
        .returning(),
      db
        .insert(productVariant)
        .values({
          productId: prod.id,
          size: "100ml",
          sku: `${prod.name.substring(0, 3).toUpperCase()}-100`,
          price: prices[4],
        })
        .returning(),
    ]);
  });

  const variants = await Promise.all(variantPromises);

  // Each variant in variants is an array of arrays, where each inner array contains one variant
  const allVariants = variants.flatMap((variantGroup) =>
    variantGroup
      .map((variantArray) => {
        if (!variantArray || variantArray.length === 0) {
          console.error("Invalid variant array:", variantArray);
          return null;
        }
        return variantArray[0];
      })
      .filter(Boolean)
  );

  // Create formulations
  const formulationPromises = allVariants.map(async (variant) => {
    if (!variant || !variant.id) {
      console.error("Invalid variant:", variant);
      throw new Error("Invalid variant object");
    }

    return db
      .insert(formulation)
      .values({
        productVariantId: variant.id,
        name: `${
          products.find((p) => p.id === variant.productId)?.name || "Unknown"
        } ${variant.size} Formula`,
        description: "Standard formulation",
        version: 1,
        isActive: true,
      })
      .returning();
  });

  const formulations = await Promise.all(formulationPromises);

  // Create formulation ingredients
  const ingredientPromises = formulations.map((form) => {
    const currentFormulation = form[0];
    if (!currentFormulation) {
      console.error("Invalid formulation:", form);
      throw new Error("Formulation not found");
    }

    const variant = allVariants.find(
      (v) => v && v.id === currentFormulation.productVariantId
    );
    if (!variant) {
      console.error("Variant not found for formulation:", currentFormulation);
      throw new Error(
        `Variant not found for formulation ${currentFormulation.id}`
      );
    }

    const prod = products.find((p) => p.id === variant.productId);
    if (!prod) throw new Error(`Product not found for variant ${variant.id}`);

    const size = parseInt(variant.size?.replace("ml", "") || "0");
    if (size === 0) throw new Error(`Invalid size for variant ${variant.id}`);

    // Calculate quantities based on bottle size
    const alcoholQuantity = (size * 0.8).toFixed(2); // 80% alcohol
    const fixativeQuantity = (size * 0.03).toFixed(2); // 3% fixative
    const mainEssenceQuantity = (size * 0.12).toFixed(2); // 12% main essence
    const secondaryEssenceQuantity = (size * 0.05).toFixed(2); // 5% secondary essence

    // Find ingredients by exact name match
    const findIngredientByName = (name: string): number => {
      const ingredient = ingredients.find((i) => i.name === name);
      if (!ingredient) throw new Error(`Ingredient not found: ${name}`);
      return ingredient.id;
    };

    // Define ingredients based on fragrance type
    let mainEssenceId: number;
    let secondaryEssenceId: number;
    let mainEssenceNote: string;
    let secondaryEssenceNote: string;

    switch (prod.name) {
      case "Imperium":
        mainEssenceId = findIngredientByName("Oud Oil");
        secondaryEssenceId = findIngredientByName("Sandalwood Oil");
        mainEssenceNote = "Main oud note";
        secondaryEssenceNote = "Sandalwood base";
        break;
      case "Horizon":
        mainEssenceId = findIngredientByName("Marine Accord");
        secondaryEssenceId = findIngredientByName("Sea Salt Accord");
        mainEssenceNote = "Fresh marine note";
        secondaryEssenceNote = "Salty accord";
        break;
      default:
        throw new Error(`Unknown product type: ${prod.name}`);
    }

    // Get packaging components based on size
    const bottleId = findIngredientByName(
      size <= 30
        ? "Luxury Glass Bottle 50mL"
        : size <= 50
        ? "Premium Glass Bottle 50mL"
        : "Premium Glass Bottle 50mL"
    );
    const pumpId = findIngredientByName(
      size >= 75 ? "Metal Spray Pump Gold" : "Metal Spray Pump Silver"
    );
    const boxId = findIngredientByName(
      size >= 75 ? "Luxury Box" : "Standard Box"
    );

    return db.insert(formulationIngredient).values([
      // Perfumer's Alcohol (80%)
      {
        formulationId: currentFormulation.id,
        ingredientId: findIngredientByName("Perfumer's Alcohol"),
        quantity: alcoholQuantity,
        unit: VolumeUnit.MILLILITER,
        notes: "Base solvent",
      },
      // Fixative (3%)
      {
        formulationId: currentFormulation.id,
        ingredientId: findIngredientByName("Fixative Base"),
        quantity: fixativeQuantity,
        unit: VolumeUnit.MILLILITER,
        notes: "Enhances longevity",
      },
      // Main Essence (12%)
      {
        formulationId: currentFormulation.id,
        ingredientId: mainEssenceId,
        quantity: mainEssenceQuantity,
        unit: VolumeUnit.MILLILITER,
        notes: mainEssenceNote,
      },
      // Secondary Essence (5%)
      {
        formulationId: currentFormulation.id,
        ingredientId: secondaryEssenceId,
        quantity: secondaryEssenceQuantity,
        unit: VolumeUnit.MILLILITER,
        notes: secondaryEssenceNote,
      },
      // Packaging components
      {
        formulationId: currentFormulation.id,
        ingredientId: bottleId,
        quantity: "1",
        unit: PieceUnit.PIECE,
        notes: `Glass bottle ${size}mL`,
      },
      {
        formulationId: currentFormulation.id,
        ingredientId: pumpId,
        quantity: "1",
        unit: PieceUnit.PIECE,
        notes: size >= 75 ? "Gold spray pump" : "Silver spray pump",
      },
      {
        formulationId: currentFormulation.id,
        ingredientId: boxId,
        quantity: "1",
        unit: PieceUnit.PIECE,
        notes: size >= 75 ? "Luxury packaging box" : "Standard packaging box",
      },
    ]);
  });

  await Promise.all(ingredientPromises);

  // Create orders for major retailers
  const orders = await db
    .insert(order)
    .values([
      {
        customerName: "Sephora France",
        customerEmail: "orders@sephora.fr",
        customerPhone: "+33-1-4013-5470",
        status: "IN_PRODUCTION",
        notes: "Q1 2025 Main Collection Launch",
        deliveryDate: new Date("2025-01-20"),
      },
      {
        customerName: "Le Printemps",
        customerEmail: "beaute@printemps.fr",
        customerPhone: "+33-1-4282-5789",
        status: "PENDING",
        notes: "Spring 2025 Luxury Collection",
        deliveryDate: new Date("2025-02-15"),
      },
    ])
    .returning();

  // Create order items with strategic quantities
  const orderItems = [
    // Sephora's order - Large quantities focusing on bestsellers and new launches
    {
      orderId: orders[0].id,
      productVariantId: allVariants.find(
        (v) =>
          v?.size === "100ml" &&
          products.find((p) => p.id === v?.productId)?.name === "Imperium"
      )?.id,
      quantity: 150,
      unitPrice: "449.99",
      notes: "Luxury collection feature",
    },
    {
      orderId: orders[0].id,
      productVariantId: allVariants.find(
        (v) =>
          v?.size === "50ml" &&
          products.find((p) => p.id === v?.productId)?.name === "Imperium"
      )?.id,
      quantity: 200,
      unitPrice: "249.99",
    },
    {
      orderId: orders[0].id,
      productVariantId: allVariants.find(
        (v) =>
          v?.size === "100ml" &&
          products.find((p) => p.id === v?.productId)?.name === "Horizon"
      )?.id,
      quantity: 100,
      unitPrice: "249.99",
      notes: "New launch special placement",
    },
    {
      orderId: orders[0].id,
      productVariantId: allVariants.find(
        (v) =>
          v?.size === "50ml" &&
          products.find((p) => p.id === v?.productId)?.name === "Horizon"
      )?.id,
      quantity: 200,
      unitPrice: "149.99",
    },

    // Le Printemps order - Focus on luxury sizes and premium offerings
    {
      orderId: orders[1].id,
      productVariantId: allVariants.find(
        (v) =>
          v?.size === "100ml" &&
          products.find((p) => p.id === v?.productId)?.name === "Imperium"
      )?.id,
      quantity: 120,
      unitPrice: "449.99",
      notes: "Premium collection centerpiece",
    },
    {
      orderId: orders[1].id,
      productVariantId: allVariants.find(
        (v) =>
          v?.size === "75ml" &&
          products.find((p) => p.id === v?.productId)?.name === "Imperium"
      )?.id,
      quantity: 150,
      unitPrice: "349.99",
    },
    {
      orderId: orders[1].id,
      productVariantId: allVariants.find(
        (v) =>
          v?.size === "100ml" &&
          products.find((p) => p.id === v?.productId)?.name === "Horizon"
      )?.id,
      quantity: 60,
      unitPrice: "249.99",
      notes: "New launch exclusive",
    },
    {
      orderId: orders[1].id,
      productVariantId: allVariants.find(
        (v) =>
          v?.size === "75ml" &&
          products.find((p) => p.id === v?.productId)?.name === "Horizon"
      )?.id,
      quantity: 80,
      unitPrice: "199.99",
    },
  ].filter(
    (item): item is typeof item & { productVariantId: number } =>
      typeof item.productVariantId === "number"
  );

  if (orderItems.length > 0) {
    await db.insert(orderItem).values(orderItems);
  }
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
