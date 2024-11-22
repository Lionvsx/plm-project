"use server";

import { db } from "@/db";
import { formula, formulaIngredient } from "@/db/schema";

export async function getFormulas() {
  return await db.query.formula.findMany({
    with: {
      ingredients: true,
    },
  });
}

export async function getIngredients() {
  return await db.query.ingredient.findMany();
}

export async function createFormula(data: typeof formula.$inferInsert) {
  return await db.insert(formula).values(data);
}

export async function addIngredientToFormula(
  data: typeof formulaIngredient.$inferInsert
) {
  return await db.insert(formulaIngredient).values(data);
}
