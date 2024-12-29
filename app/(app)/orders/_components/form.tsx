"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import {
  createOrder,
  updateOrder,
  calculateOrderIngredientNeeds,
  type OrderIngredientNeeds,
} from "@/controllers/orders";
import { Order, ProductVariant } from "@/db/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const orderItemSchema = z.object({
  productVariantId: z.coerce.number().min(1, "Product variant is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  notes: z.string().optional(),
});

const formSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email().optional().or(z.literal("")),
  customerPhone: z.string().optional(),
  notes: z.string().optional(),
  deliveryDate: z.string().optional(),
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
});

type OrderItemFormValues = z.infer<typeof orderItemSchema>;

interface FormProps {
  initialData?: Order & {
    items?: Array<{
      id: number;
      orderId: number;
      productVariantId: number;
      quantity: number;
      notes: string | null;
      unitPrice: string;
      productVariant: ProductVariant & {
        product: { id: number; name: string; category: string } | null;
      };
    }>;
  };
  productVariants: Array<
    ProductVariant & {
      product: { id: number; name: string; category: string } | null;
    }
  >;
  isEditing?: boolean;
}

export function OrderForm({
  initialData,
  productVariants,
  isEditing,
}: FormProps) {
  const router = useRouter();
  const [ingredientNeeds, setIngredientNeeds] = useState<
    OrderIngredientNeeds[]
  >([]);
  const [showNeedsDialog, setShowNeedsDialog] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: initialData?.customerName || "",
      customerEmail: initialData?.customerEmail || "",
      customerPhone: initialData?.customerPhone || "",
      notes: initialData?.notes || "",
      deliveryDate: initialData?.deliveryDate
        ? new Date(initialData.deliveryDate).toISOString().split("T")[0]
        : "",
      items: initialData?.items?.map((item) => ({
        productVariantId: item.productVariantId,
        quantity: item.quantity,
        notes: item.notes || "",
      })) || [{ productVariantId: 0, quantity: 1, notes: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const orderData = {
        ...values,
        deliveryDate: values.deliveryDate
          ? new Date(values.deliveryDate)
          : undefined,
        items: values.items.map((item) => ({
          ...item,
          unitPrice: Number(
            productVariants.find((v) => v.id === item.productVariantId)
              ?.price || "0"
          ),
        })),
      };

      if (isEditing && initialData) {
        await updateOrder(initialData.id, {
          ...orderData,
          status: initialData.status,
        });
      } else {
        await createOrder({ ...orderData, status: "PENDING" });
      }
      router.push("/orders");
      router.refresh();
    } catch (error) {
      console.error("Error saving order:", error);
    }
  }

  const confirmProductionChange = async () => {
    if (!initialData) return;

    try {
      const orderData = form.getValues();
      await updateOrder(initialData.id, {
        ...orderData,
        deliveryDate: orderData.deliveryDate
          ? new Date(orderData.deliveryDate)
          : undefined,
        items: orderData.items.map((item) => ({
          ...item,
          unitPrice: Number(
            productVariants.find((v) => v.id === item.productVariantId)
              ?.price || "0"
          ),
        })),
      });
      router.push("/orders");
      router.refresh();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <>
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

          <FormField
            control={form.control}
            name="customerEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="customer@example.com"
                    {...field}
                  />
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
                  <Input placeholder="Phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Order Items</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({ productVariantId: 0, quantity: 1, notes: "" })
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex gap-4 items-start p-4 border rounded-lg"
                >
                  <div className="flex-1 space-y-4">
                    <FormField
                      control={form.control}
                      name={`items.${index}.productVariantId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(parseInt(value))
                            }
                            value={field.value.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a product" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {productVariants.map((variant) => (
                                <SelectItem
                                  key={variant.id}
                                  value={variant.id.toString()}
                                >
                                  {variant.product?.name} - {variant.size} (
                                  {formatCurrency(variant.price || "0")})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.notes`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                              <Input placeholder="Item notes" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="mt-8"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order Notes</FormLabel>
                <FormControl>
                  <Textarea placeholder="Additional notes" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">
            {isEditing ? "Update Order" : "Create Order"}
          </Button>
        </form>
      </Form>

      <Dialog open={showNeedsDialog} onOpenChange={setShowNeedsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Production Start</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Review the required ingredients before starting production:
            </p>

            <div className="space-y-2">
              {ingredientNeeds.map((need) => (
                <div
                  key={need.ingredientId}
                  className="flex items-center justify-between p-2 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{need.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Needs: {need.totalQuantity} {need.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        need.isStockCritical ? "destructive" : "secondary"
                      }
                    >
                      Stock: {need.availableStock} {need.unit}
                    </Badge>
                    {need.isStockCritical && (
                      <p className="text-xs text-destructive mt-1">
                        Insufficient stock
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNeedsDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={confirmProductionChange}
                disabled={ingredientNeeds.some((need) => need.isStockCritical)}
              >
                Start Production
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
