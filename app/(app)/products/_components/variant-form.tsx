"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { useRouter } from "next/navigation";
import { addProductVariant, updateProductVariant } from "@/controllers/products";
import { ProductVariant } from "@/db/schema";
import { upload } from '@vercel/blob/client';
import { useState, useRef } from 'react';

const formSchema = z.object({
  size: z.string().min(1, "Size is required"),
  sku: z.string().min(1, "SKU is required"),
  price: z.string().optional(),
  cadFileUrl: z.string().optional(),
});

interface FormProps {
  productId: number;
  initialData?: ProductVariant;
}

export function VariantForm({ productId, initialData }: FormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      size: initialData?.size || "",
      sku: initialData?.sku || "",
      price: initialData?.price?.toString() || "",
      cadFileUrl: initialData?.cadFileUrl || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsUploading(true);

      // Handle file upload if a file is selected
      if (fileInputRef.current?.files?.[0]) {
        const file = fileInputRef.current.files[0];
        const blob = await upload(file.name, file, {
          access: 'public',
          handleUploadUrl: '/api/blob/upload',
        });
        values.cadFileUrl = blob.url;
      }

      if (initialData) {
        await updateProductVariant(initialData.id, values);
      } else {
        await addProductVariant(productId, values);
      }
      router.push(`/products/${productId}`);
      router.refresh();
    } catch (error) {
      console.error("Error saving variant:", error);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Size</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 50ml, 100ml" {...field} />
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
                <Input placeholder="Stock Keeping Unit" {...field} />
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
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cadFileUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CAD File</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-2">
                  <Input
                    type="file"
                    ref={fileInputRef}
                  />
                  {field.value && (
                    <div className="flex items-center gap-2 text-sm">
                      <span>Current file:</span>
                      <a
                        href={field.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {field.value.split('/').pop()}
                      </a>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : initialData ? "Update Variant" : "Add Variant"}
        </Button>
      </form>
    </Form>
  );
}
