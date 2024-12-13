"use server";

import { db } from "@/db";
import { supplier } from "@/db/schema";

export async function getSuppliers() {
  const suppliers = await db.query.supplier.findMany();
  return suppliers;
}
