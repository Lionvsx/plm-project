"use server";

import { db } from "@/db";
import { supplier } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getSuppliers() {
  const suppliers = await db.query.supplier.findMany();
  return suppliers;
}

export async function getSupplier(id: number) {
  return await db.query.supplier.findFirst({
    where: eq(supplier.id, id),
  });
}
