"use server";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { formula } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function getFormulas() {
  return await db.query.formula.findMany({
    with: {
      variants: true,
    },
  });
}

export async function getFormula(id: string | number) {
  const formulaId = typeof id === 'string' ? parseInt(id) : id;
  
  if (isNaN(formulaId)) {
    throw new Error('Invalid formula ID');
  }

  return await db.query.formula.findFirst({
    where: eq(formula.id, formulaId),
    with: {
      variants: true,
    }
  });
}

export async function createFormula(data: typeof formula.$inferInsert) {
  return await db.insert(formula).values(data);
}

export async function updateFormula(
  id: number,
  data: Partial<typeof formula.$inferInsert>
) {
  return await db.update(formula).set(data).where(eq(formula.id, id));
}

export async function deleteFormula(id: number) {
  return await db.delete(formula).where(eq(formula.id, id));
}
