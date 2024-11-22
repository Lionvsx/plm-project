"use server";

import {
  createProduct,
  updateProduct,
} from "@/controllers/products";
import { ServerActionResult } from "@/lib/types";
import { ProductFormValues } from "@/lib/validators/product";
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
