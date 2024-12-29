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
      .returning() as Promise<Supplier[]>,
    db
      .insert(supplier)
      .values({
        name: "Natural Scents Ltd.",
        email: "emma@naturalscents.com",
        phone: "+1-555-0124",
        address: "456 Aroma Street, Los Angeles, CA 90001",
      })
      .returning() as Promise<Supplier[]>,
    db
      .insert(supplier)
      .values({
        name: "Base Materials Inc.",
        email: "michael@basematerials.com",
        phone: "+1-555-0125",
        address: "789 Chemical Road, Chicago, IL 60601",
      })
      .returning() as Promise<Supplier[]>,
    db
      .insert(supplier)
      .values({
        name: "Premium Packaging Co.",
        email: "sarah@premiumpackaging.com",
        phone: "+1-555-0126",
        address: "321 Box Street, Miami, FL 33101",
      })
      .returning() as Promise<Supplier[]>,
    db
      .insert(supplier)
      .values({
        name: "Luxury Containers Ltd.",
        email: "david@luxurycontainers.com",
        phone: "+1-555-0127",
        address: "654 Glass Avenue, Seattle, WA 98101",
      })
      .returning() as Promise<Supplier[]>,
    db
      .insert(supplier)
      .values({
        name: "Oriental Essences Co.",
        email: "ali@orientalessences.com",
        phone: "+1-555-0128",
        address: "789 Spice Road, Dubai",
      })
      .returning() as Promise<Supplier[]>,
    db
      .insert(supplier)
      .values({
        name: "Marine Fragrances Inc.",
        email: "marie@marinefragrances.com",
        phone: "+1-555-0129",
        address: "456 Ocean Drive, Miami, FL 33139",
      })
      .returning() as Promise<Supplier[]>,
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
    .returning()) as unknown as Ingredient[];

  // Create products
  const products = (await db
    .insert(product)
    .values([
      // Floral Fragrances
      {
        name: "Midnight Rose",
        description: "A luxurious floral fragrance with deep rose notes",
        category: "Eau de Parfum",
        launchDate: new Date("2025-01-15"),
      },
      {
        name: "Jasmine Nights",
        description: "An enchanting blend of jasmine and ylang ylang",
        category: "Eau de Parfum",
        launchDate: new Date("2025-02-15"),
      },
      // Citrus Fragrances
      {
        name: "Citrus Dream",
        description: "Fresh and vibrant citrus blend with bergamot",
        category: "Eau de Toilette",
        launchDate: new Date("2025-02-01"),
      },
      {
        name: "Mediterranean Breeze",
        description: "Bright and zesty blend of orange and lemon",
        category: "Eau de Toilette",
        launchDate: new Date("2025-03-01"),
      },
      // Oriental/Woody Fragrances
      {
        name: "Oud Wood",
        description: "Rich and mysterious blend of oud and sandalwood",
        category: "Eau de Parfum",
        launchDate: new Date("2025-03-15"),
      },
      {
        name: "Vanilla Amber",
        description: "Warm and sensual mix of vanilla and amber",
        category: "Eau de Parfum",
        launchDate: new Date("2025-04-01"),
      },
      // Fresh/Aquatic Fragrances
      {
        name: "Ocean Mist",
        description: "Fresh marine scent with salty notes",
        category: "Eau de Toilette",
        launchDate: new Date("2025-04-15"),
      },
      {
        name: "Fresh Rain",
        description: "Clean and refreshing aquatic fragrance",
        category: "Eau de Toilette",
        launchDate: new Date("2025-05-01"),
      },
    ])
    .returning()) as unknown as Product[];

  // Create product variants with appropriate pricing
  const variantPromises = products.map((prod: Product) => {
    let prices: string[];
    switch (prod.name) {
      case "Midnight Rose":
        prices = ["49.99", "69.99", "139.99"]; // Premium floral
        break;
      case "Jasmine Nights":
        prices = ["49.99", "69.99", "139.99"]; // Premium floral
        break;
      case "Citrus Dream":
        prices = ["34.99", "49.99", "89.99"]; // Fresh citrus
        break;
      case "Mediterranean Breeze":
        prices = ["34.99", "49.99", "89.99"]; // Fresh citrus
        break;
      case "Oud Wood":
        prices = ["59.99", "89.99", "169.99"]; // Premium oriental
        break;
      case "Vanilla Amber":
        prices = ["54.99", "79.99", "149.99"]; // Premium oriental
        break;
      case "Ocean Mist":
        prices = ["39.99", "59.99", "99.99"]; // Fresh aquatic
        break;
      case "Fresh Rain":
        prices = ["39.99", "59.99", "99.99"]; // Fresh aquatic
        break;
      default:
        prices = ["39.99", "59.99", "99.99"]; // Default pricing
    }

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

  // Create orders for retail clients
  const orders = await db
    .insert(order)
    .values([
      {
        customerName: "Sephora France",
        customerEmail: "orders@sephora.fr",
        customerPhone: "+33-1-4013-5470",
        status: "COMPLETED",
        notes: "Major retail chain - Q1 2025 bulk order",
        deliveryDate: new Date("2024-12-15"),
      },
      {
        customerName: "Marionnaud",
        customerEmail: "purchasing@marionnaud.com",
        customerPhone: "+33-1-4286-7890",
        status: "COMPLETED",
        notes: "National retail chain - January restock",
        deliveryDate: new Date("2024-12-27"),
      },
      {
        customerName: "L'Essence des Parfums",
        customerEmail: "contact@lessencedesparfums.fr",
        customerPhone: "+33-4-9134-5678",
        status: "IN_PRODUCTION",
        notes: "Luxury boutique in Cannes - New Year collection",
        deliveryDate: new Date("2025-01-10"),
      },
      {
        customerName: "Galeries Lafayette",
        customerEmail: "parfums@galerieslafayette.com",
        customerPhone: "+33-1-4282-3456",
        status: "PENDING",
        notes: "Department store - Valentine's Day collection",
        deliveryDate: new Date("2025-01-25"),
      },
      {
        customerName: "Nocibé",
        customerEmail: "commandes@nocibe.fr",
        customerPhone: "+33-3-2045-6789",
        status: "PENDING",
        notes: "National perfume retailer - January restock",
        deliveryDate: new Date("2025-01-15"),
      },
      {
        customerName: "Beauty Success",
        customerEmail: "achats@beautysuccess.fr",
        customerPhone: "+33-5-5678-9012",
        status: "IN_PRODUCTION",
        notes: "Regional chain - New Year collection",
        deliveryDate: new Date("2025-01-08"),
      },
      {
        customerName: "Le Printemps",
        customerEmail: "beaute@printemps.fr",
        customerPhone: "+33-1-4282-5789",
        status: "PENDING",
        notes: "Department store - Valentine's Day preview",
        deliveryDate: new Date("2025-01-30"),
      },
      {
        customerName: "Douglas France",
        customerEmail: "orders@douglas.fr",
        customerPhone: "+33-1-4567-8901",
        status: "IN_PRODUCTION",
        notes: "International beauty retailer - January collection",
        deliveryDate: new Date("2025-01-12"),
      },
      {
        customerName: "Passion Beauté",
        customerEmail: "commandes@passionbeaute.fr",
        customerPhone: "+33-1-7890-1234",
        status: "PENDING",
        notes: "Selective perfumery chain - New Year selection",
        deliveryDate: new Date("2025-01-18"),
      },
    ])
    .returning();

  // Create order items with quantities matching retailer size
  await db.insert(orderItem).values([
    // Sephora's order - Large quantities of various products
    {
      orderId: orders[0].id,
      productVariantId: allVariants[2].id, // Midnight Rose 100ml
      quantity: 100,
      unitPrice: "139.99",
      notes: "Premium placement in stores",
    },
    {
      orderId: orders[0].id,
      productVariantId: allVariants[1].id, // Midnight Rose 50ml
      quantity: 150,
      unitPrice: "69.99",
    },
    {
      orderId: orders[0].id,
      productVariantId: allVariants[14].id, // Oud Wood 100ml
      quantity: 80,
      unitPrice: "169.99",
      notes: "Luxury collection display",
    },
    {
      orderId: orders[0].id,
      productVariantId: allVariants[13].id, // Oud Wood 50ml
      quantity: 120,
      unitPrice: "89.99",
    },
    {
      orderId: orders[0].id,
      productVariantId: allVariants[5].id, // Jasmine Nights 100ml
      quantity: 60,
      unitPrice: "139.99",
      notes: "New collection feature",
    },
    {
      orderId: orders[0].id,
      productVariantId: allVariants[17].id, // Vanilla Amber 100ml
      quantity: 50,
      unitPrice: "149.99",
    },

    // Marionnaud's order - Medium quantities
    {
      orderId: orders[1].id,
      productVariantId: allVariants[1].id, // Midnight Rose 50ml
      quantity: 60,
      unitPrice: "69.99",
    },
    {
      orderId: orders[1].id,
      productVariantId: allVariants[7].id, // Citrus Dream 50ml
      quantity: 45,
      unitPrice: "49.99",
    },
    {
      orderId: orders[1].id,
      productVariantId: allVariants[19].id, // Ocean Mist 50ml
      quantity: 40,
      unitPrice: "59.99",
    },
    {
      orderId: orders[1].id,
      productVariantId: allVariants[13].id, // Oud Wood 50ml
      quantity: 35,
      unitPrice: "89.99",
      notes: "Valentine's Day promotion",
    },

    // L'Essence des Parfums - Boutique order
    {
      orderId: orders[2].id,
      productVariantId: allVariants[2].id, // Midnight Rose 100ml
      quantity: 15,
      unitPrice: "139.99",
      notes: "New Year luxury display",
    },
    {
      orderId: orders[2].id,
      productVariantId: allVariants[14].id, // Oud Wood 100ml
      quantity: 12,
      unitPrice: "169.99",
      notes: "Featured in luxury collection",
    },
    {
      orderId: orders[2].id,
      productVariantId: allVariants[17].id, // Vanilla Amber 100ml
      quantity: 10,
      unitPrice: "149.99",
    },

    // Galeries Lafayette - Department store order
    {
      orderId: orders[3].id,
      productVariantId: allVariants[2].id, // Midnight Rose 100ml
      quantity: 70,
      unitPrice: "139.99",
      notes: "Valentine's Day feature",
    },
    {
      orderId: orders[3].id,
      productVariantId: allVariants[5].id, // Jasmine Nights 100ml
      quantity: 60,
      unitPrice: "139.99",
    },
    {
      orderId: orders[3].id,
      productVariantId: allVariants[14].id, // Oud Wood 100ml
      quantity: 50,
      unitPrice: "169.99",
    },
    {
      orderId: orders[3].id,
      productVariantId: allVariants[8].id, // Mediterranean Breeze 100ml
      quantity: 40,
      unitPrice: "89.99",
    },
    {
      orderId: orders[3].id,
      productVariantId: allVariants[20].id, // Fresh Rain 100ml
      quantity: 35,
      unitPrice: "99.99",
    },

    // Nocibé - National chain order
    {
      orderId: orders[4].id,
      productVariantId: allVariants[1].id, // Midnight Rose 50ml
      quantity: 80,
      unitPrice: "69.99",
    },
    {
      orderId: orders[4].id,
      productVariantId: allVariants[7].id, // Citrus Dream 50ml
      quantity: 70,
      unitPrice: "49.99",
    },
    {
      orderId: orders[4].id,
      productVariantId: allVariants[19].id, // Ocean Mist 50ml
      quantity: 60,
      unitPrice: "59.99",
    },
    {
      orderId: orders[4].id,
      productVariantId: allVariants[16].id, // Vanilla Amber 50ml
      quantity: 45,
      unitPrice: "79.99",
      notes: "New Year promotion",
    },

    // Beauty Success - Regional chain
    {
      orderId: orders[5].id,
      productVariantId: allVariants[0].id, // Midnight Rose 30ml
      quantity: 30,
      unitPrice: "49.99",
    },
    {
      orderId: orders[5].id,
      productVariantId: allVariants[6].id, // Citrus Dream 30ml
      quantity: 35,
      unitPrice: "34.99",
    },
    {
      orderId: orders[5].id,
      productVariantId: allVariants[18].id, // Ocean Mist 30ml
      quantity: 25,
      unitPrice: "39.99",
    },

    // Le Printemps - Department store
    {
      orderId: orders[6].id,
      productVariantId: allVariants[2].id, // Midnight Rose 100ml
      quantity: 60,
      unitPrice: "139.99",
      notes: "Valentine's Day collection",
    },
    {
      orderId: orders[6].id,
      productVariantId: allVariants[8].id, // Mediterranean Breeze 100ml
      quantity: 50,
      unitPrice: "89.99",
    },
    {
      orderId: orders[6].id,
      productVariantId: allVariants[20].id, // Fresh Rain 100ml
      quantity: 45,
      unitPrice: "99.99",
    },
    {
      orderId: orders[6].id,
      productVariantId: allVariants[5].id, // Jasmine Nights 100ml
      quantity: 40,
      unitPrice: "139.99",
      notes: "Valentine's Day promotion",
    },

    // Douglas France - International retailer
    {
      orderId: orders[7].id,
      productVariantId: allVariants[1].id, // Midnight Rose 50ml
      quantity: 90,
      unitPrice: "69.99",
    },
    {
      orderId: orders[7].id,
      productVariantId: allVariants[13].id, // Oud Wood 50ml
      quantity: 70,
      unitPrice: "89.99",
    },
    {
      orderId: orders[7].id,
      productVariantId: allVariants[16].id, // Vanilla Amber 50ml
      quantity: 60,
      unitPrice: "79.99",
    },
    {
      orderId: orders[7].id,
      productVariantId: allVariants[19].id, // Ocean Mist 50ml
      quantity: 50,
      unitPrice: "59.99",
      notes: "January promotion",
    },

    // Passion Beauté - Selective perfumery
    {
      orderId: orders[8].id,
      productVariantId: allVariants[1].id, // Midnight Rose 50ml
      quantity: 25,
      unitPrice: "69.99",
    },
    {
      orderId: orders[8].id,
      productVariantId: allVariants[7].id, // Citrus Dream 50ml
      quantity: 30,
      unitPrice: "49.99",
    },
    {
      orderId: orders[8].id,
      productVariantId: allVariants[19].id, // Ocean Mist 50ml
      quantity: 20,
      unitPrice: "59.99",
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
    const size = parseInt(variant?.size?.replace("ml", "") || "0");

    // Calculate quantities based on bottle size
    const alcoholQuantity = (size * 0.8).toFixed(2); // 80% alcohol
    const fixativeQuantity = (size * 0.03).toFixed(2); // 3% fixative
    const mainEssenceQuantity = (size * 0.12).toFixed(2); // 12% main essence
    const secondaryEssenceQuantity = (size * 0.05).toFixed(2); // 5% secondary essence

    // Define ingredients based on fragrance type
    let mainEssenceId: number;
    let secondaryEssenceId: number;
    let mainEssenceNote: string;
    let secondaryEssenceNote: string;

    switch (prod?.name) {
      case "Midnight Rose":
        mainEssenceId = ingredients[0].id; // Rose Oil
        secondaryEssenceId = ingredients[1].id; // Jasmine
        mainEssenceNote = "Main rose note";
        secondaryEssenceNote = "Supporting jasmine note";
        break;
      case "Jasmine Nights":
        mainEssenceId = ingredients[1].id; // Jasmine
        secondaryEssenceId = ingredients[12].id; // Ylang Ylang
        mainEssenceNote = "Main jasmine note";
        secondaryEssenceNote = "Supporting ylang ylang note";
        break;
      case "Citrus Dream":
        mainEssenceId = ingredients[2].id; // Bergamot
        secondaryEssenceId = ingredients[3].id; // Vanilla
        mainEssenceNote = "Main citrus note";
        secondaryEssenceNote = "Vanilla base note";
        break;
      case "Mediterranean Breeze":
        mainEssenceId = ingredients[13].id; // Orange
        secondaryEssenceId = ingredients[14].id; // Lemon
        mainEssenceNote = "Main orange note";
        secondaryEssenceNote = "Fresh lemon note";
        break;
      case "Oud Wood":
        mainEssenceId = ingredients[15].id; // Oud
        secondaryEssenceId = ingredients[17].id; // Sandalwood
        mainEssenceNote = "Main oud note";
        secondaryEssenceNote = "Sandalwood base";
        break;
      case "Vanilla Amber":
        mainEssenceId = ingredients[3].id; // Vanilla
        secondaryEssenceId = ingredients[16].id; // Amber
        mainEssenceNote = "Rich vanilla note";
        secondaryEssenceNote = "Warm amber base";
        break;
      case "Ocean Mist":
        mainEssenceId = ingredients[18].id; // Marine Accord
        secondaryEssenceId = ingredients[19].id; // Sea Salt
        mainEssenceNote = "Fresh marine note";
        secondaryEssenceNote = "Salty accord";
        break;
      case "Fresh Rain":
        mainEssenceId = ingredients[20].id; // Rain Accord
        secondaryEssenceId = ingredients[2].id; // Bergamot
        mainEssenceNote = "Rain accord";
        secondaryEssenceNote = "Fresh bergamot note";
        break;
      default:
        mainEssenceId = ingredients[0].id;
        secondaryEssenceId = ingredients[1].id;
        mainEssenceNote = "Main note";
        secondaryEssenceNote = "Supporting note";
    }

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
        ingredientId:
          size === 30
            ? ingredients[9].id // Premium Glass Bottle 30mL
            : size === 50
            ? ingredients[10].id // Premium Glass Bottle 50mL
            : ingredients[11].id, // Premium Glass Bottle 100mL
        quantity: "1",
        unit: PieceUnit.PIECE,
        notes: `Glass bottle ${size}mL`,
      },
      {
        formulationId: currentFormulation.id,
        ingredientId: size === 100 ? ingredients[12].id : ingredients[13].id, // Gold pump for 100ml, silver for others
        quantity: "1",
        unit: PieceUnit.PIECE,
        notes: size === 100 ? "Gold spray pump" : "Silver spray pump",
      },
      {
        formulationId: currentFormulation.id,
        ingredientId: size === 100 ? ingredients[14].id : ingredients[15].id, // Luxury box for 100ml, standard for others
        quantity: "1",
        unit: PieceUnit.PIECE,
        notes: size === 100 ? "Luxury packaging box" : "Standard packaging box",
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
