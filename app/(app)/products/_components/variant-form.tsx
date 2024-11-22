"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { VariantProductFormValues, variantSchema } from "@/lib/validators/product_variant";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createVariant, updateVariant } from "../actions";

interface VariantFormProps {
  productId: number;
  initialValues?: {
    id: number;
    size: string | null;
    sku: string | null;
    price: string | null;
  };
}

export function VariantForm({ productId, initialValues }: VariantFormProps) {
  const router = useRouter();

  const form = useForm<VariantProductFormValues>({
    resolver: zodResolver(variantSchema),
    defaultValues: initialValues
      ? {
        ...initialValues,
        size: initialValues.size ?? "",
        sku: initialValues.sku ?? "",
        price: initialValues.price ?? "",
        productId,
      }
      : {
        size: "",
        sku: "",
        price: "",
        productId,
      },
  });

  const onSubmit = async (data: VariantProductFormValues) => {
    try {
      if (!initialValues) {
        await createVariant(data);
        toast.success("Variant created successfully");
      } else {
        await updateVariant(initialValues.id, data);
        toast.success("Variant updated successfully");
      }
      router.refresh();
      router.push(`/products/${productId}`);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Size</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SKU</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input {...field} type="number" step="0.01" min="0" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {initialValues ? "Update Variant" : "Create Variant"}
        </Button>
      </form>
    </Form>
  );
}
