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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createOrder, updateOrder } from "@/controllers/orders";
import type { getOrders } from "@/controllers/orders";
import { ProductVariant } from "@/db/schema";
import { orderSchema } from "@/lib/validators/orders";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Plus, Trash } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type Order = Awaited<ReturnType<typeof getOrders>>[number];

interface FormProps {
  productVariants: Array<{
    id: number;
    productId: number | null;
    size: string | null;
    sku: string | null;
    price: string | null;
    product: {
      id: number;
      name: string;
      category: string;
    } | null;
  }>;
  initialData?: Order;
}

export function OrderForm({ productVariants, initialData }: FormProps) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: initialData?.customerName || "",
      customerEmail: initialData?.customerEmail || "",
      customerPhone: initialData?.customerPhone || "",
      notes: initialData?.notes || "",
      deliveryDate: initialData?.deliveryDate
        ? new Date(initialData.deliveryDate).toISOString().split("T")[0]
        : "",
      items: initialData?.items?.map((item) => ({
        productVariantId: item.productVariant.id.toString(),
        quantity: item.quantity,
        notes: item.notes || "",
      })) || [{ productVariantId: "", quantity: 1, notes: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control,
  });

  async function onSubmit(values: any) {
    try {
      const orderData = {
        ...values,
        deliveryDate: values.deliveryDate
          ? new Date(values.deliveryDate)
          : undefined,
        items: values.items.map((item: any) => ({
          ...item,
          productVariantId: parseInt(item.productVariantId),
          unitPrice:
            productVariants.find(
              (v) => v.id === parseInt(item.productVariantId)
            )?.price || "0",
        })),
      };

      if (initialData) {
        await updateOrder(initialData.id, orderData);
      } else {
        await createOrder(orderData);
      }

      router.push("/orders");
      router.refresh();
    } catch (error) {
      console.error("Error saving order:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Name</FormLabel>
              <FormControl>
                <Input placeholder="Customer name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="customerEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Phone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="deliveryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Delivery Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Products</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({ productVariantId: "", quantity: 1, notes: "" })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-4 items-end">
              <FormField
                control={form.control}
                name={`items.${index}.productVariantId`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Product</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {productVariants
                          .filter((variant) => variant.product)
                          .map((variant) => (
                            <SelectItem
                              key={variant.id}
                              value={variant.id.toString()}
                            >
                              {variant.product?.name} - {variant.size} -{" "}
                              {formatCurrency(variant.price || "0")}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`items.${index}.quantity`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Additional notes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {initialData ? "Update Order" : "Create Order"}
        </Button>
      </form>
    </Form>
  );
}
