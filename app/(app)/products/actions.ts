"use server";

import { createProduct, updateProduct } from "@/controllers/products";
import {
  createVariant as createVariantController,
  updateVariant as updateVariantController,
  deleteVariant as deleteVariantController,
} from "@/controllers/product-variants";
import { ServerActionResult } from "@/lib/types";
import { ProductFormValues } from "@/lib/validators/product";
import { VariantFormValues } from "@/lib/validators/variant";
import { revalidatePath } from "next/cache";

export const handleUpdate = async (
  id: number,
  values: ProductFormValues
): Promise<ServerActionResult<void>> => {
  await updateProduct(id, values);
  revalidatePath("/products");
  return { success: true, data: undefined };
};

export const handleCreate = async (
  values: ProductFormValues
): Promise<ServerActionResult<void>> => {
  await createProduct(values);
  revalidatePath("/products");
  return { success: true, data: undefined };
};

export async function createVariant(data: VariantFormValues) {
  const variant = await createVariantController(data);
  revalidatePath(`/products/${data.productId}`);
  return variant;
}

export async function updateVariant(id: number, data: VariantFormValues) {
  const variant = await updateVariantController(id, data);
  revalidatePath(`/products/${data.productId}`);
  return variant;
}

export async function deleteVariant(id: number, productId: number) {
  await deleteVariantController(id);
  revalidatePath(`/products/${productId}`);
}
