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
import { createOrder } from "@/controllers/orders";
import { ProductVariant } from "@/db/schema";
import { orderSchema } from "@/lib/validators/orders";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Plus, Trash } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

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
}

export function OrderForm({ productVariants }: FormProps) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      notes: "",
      deliveryDate: "",
      items: [{ productVariantId: "", quantity: 1, notes: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control,
  });

  async function onSubmit(values: any) {
    try {
      await createOrder({
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
            )?.price || 0,
        })),
      });
      router.push("/orders");
      router.refresh();
    } catch (error) {
      console.error("Error creating order:", error);
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
              <FormLabel>Nom du client</FormLabel>
              <FormControl>
                <Input placeholder="Nom du client" {...field} />
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
                <FormLabel>Téléphone</FormLabel>
                <FormControl>
                  <Input placeholder="Téléphone" {...field} />
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
              <FormLabel>Date de livraison</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Produits</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({ productVariantId: "", quantity: 1, notes: "" })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un produit
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-4 items-end">
              <FormField
                control={form.control}
                name={`items.${index}.productVariantId`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Produit</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un produit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {productVariants.map((variant) => (
                          <SelectItem
                            key={variant.id}
                            value={variant.id.toString()}
                          >
                            {variant.product?.name} -{" "}
                            {formatCurrency(variant.price)}
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
                    <FormLabel>Quantité</FormLabel>
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
                <Textarea placeholder="Notes supplémentaires" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Créer la commande</Button>
      </form>
    </Form>
  );
}
