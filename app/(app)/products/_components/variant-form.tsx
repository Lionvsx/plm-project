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

const formSchema = z.object({
    size: z.string().min(1, "Size is required"),
    sku: z.string().min(1, "SKU is required"),
    price: z.string().optional(),
});

interface FormProps {
    productId: number;
    initialData?: ProductVariant;
}

export function VariantForm({ productId, initialData }: FormProps) {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            size: initialData?.size || "",
            sku: initialData?.sku || "",
            price: initialData?.price?.toString() || "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (initialData) {
                await updateProductVariant(initialData.id, values);
            } else {
                await addProductVariant(productId, values);
            }
            router.push(`/products/${productId}`);
            router.refresh();
        } catch (error) {
            console.error("Error saving variant:", error);
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

                <Button type="submit">
                    {initialData ? "Update Variant" : "Add Variant"}
                </Button>
            </form>
        </Form>
    );
}
