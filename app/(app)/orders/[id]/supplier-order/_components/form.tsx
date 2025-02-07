"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash } from "lucide-react";
import type { OrderIngredientNeeds } from "@/controllers/orders";
import type { Supplier } from "@/db/schema";

interface SupplierOrderFormProps {
  orderId: number;
  supplierNeeds: Array<{
    supplier: Supplier;
    ingredients: Array<OrderIngredientNeeds & { orderQuantity: number }>;
  }>;
  allIngredients: OrderIngredientNeeds[];
  suppliers: Supplier[];
}

export function SupplierOrderForm({
  orderId,
  supplierNeeds,
  allIngredients,
  suppliers,
}: SupplierOrderFormProps) {
  const router = useRouter();
  const [additionalIngredients, setAdditionalIngredients] = useState<
    Array<{
      supplierId: number;
      ingredientId: number;
      quantity: number;
    }>
  >([]);
  const [additionalSuppliers, setAdditionalSuppliers] = useState<number[]>([]);
  const [supplierSelectKey, setSupplierSelectKey] = useState(0);

  // Combine les fournisseurs requis et additionnels
  const allSupplierIds = Array.from(
    new Set([
      ...supplierNeeds.map((n) => n.supplier.id),
      ...additionalSuppliers,
    ])
  );

  const handleQuantityChange = (
    supplierId: number,
    ingredientId: number,
    quantity: number
  ) => {
    const existingIndex = additionalIngredients.findIndex(
      (item) =>
        item.supplierId === supplierId && item.ingredientId === ingredientId
    );

    if (existingIndex >= 0) {
      const newIngredients = [...additionalIngredients];
      newIngredients[existingIndex].quantity = quantity;
      setAdditionalIngredients(newIngredients);
    } else {
      setAdditionalIngredients([
        ...additionalIngredients,
        { supplierId, ingredientId, quantity },
      ]);
    }
  };

  const addIngredient = (supplierId: number) => {
    const hasEmptyRow = additionalIngredients.some(
      (item) => item.supplierId === supplierId && item.ingredientId === 0
    );
    if (!hasEmptyRow) {
      setAdditionalIngredients([
        ...additionalIngredients,
        { supplierId, ingredientId: 0, quantity: 0 },
      ]);
    }
  };

  const handleIngredientSelect = (supplierId: number, ingredientId: number) => {
    const existingIndex = additionalIngredients.findIndex(
      (item) => item.supplierId === supplierId && item.ingredientId === 0
    );

    if (existingIndex >= 0) {
      const newIngredients = [...additionalIngredients];
      newIngredients[existingIndex].ingredientId = ingredientId;
      setAdditionalIngredients(newIngredients);
    }
  };

  const removeIngredient = (index: number) => {
    setAdditionalIngredients(
      additionalIngredients.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async () => {
    // TODO: Implement supplier order creation
    router.push(`/orders/${orderId}`);
  };

  const addSupplier = () => {
    setAdditionalSuppliers([...additionalSuppliers]);
  };

  return (
    <div className="space-y-6">
      {/* Required suppliers */}
      {supplierNeeds.map((supplierNeed) => {
        const { supplier, ingredients: requiredIngredients } = supplierNeed;
        return (
          <Card key={supplier.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CardTitle>{supplier.name}</CardTitle>
                  <Badge variant="secondary">Required</Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addIngredient(supplier.id)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Ingredient
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Required ingredients */}
                {requiredIngredients.map((ingredient) => (
                  <div
                    key={ingredient.ingredientId}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{ingredient.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Current Stock: {ingredient.availableStock}{" "}
                        {ingredient.unit}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        className="w-24"
                        defaultValue={ingredient.orderQuantity}
                        min={ingredient.orderQuantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            supplier.id,
                            ingredient.ingredientId,
                            parseFloat(e.target.value)
                          )
                        }
                      />
                      <span className="text-sm text-muted-foreground">
                        {ingredient.unit}
                      </span>
                    </div>
                    <Badge variant="secondary">Required</Badge>
                  </div>
                ))}

                {/* Additional ingredients for required suppliers */}
                {additionalIngredients
                  .filter((item) => item.supplierId === supplier.id)
                  .map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <Select
                          value={
                            item.ingredientId
                              ? item.ingredientId.toString()
                              : ""
                          }
                          onValueChange={(value) => {
                            const ingredientId = parseInt(value);
                            if (!isNaN(ingredientId)) {
                              handleIngredientSelect(supplier.id, ingredientId);
                              handleQuantityChange(
                                supplier.id,
                                ingredientId,
                                0
                              );
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select ingredient">
                              {item.ingredientId
                                ? allIngredients.find(
                                    (i) => i.ingredientId === item.ingredientId
                                  )?.name
                                : "Select ingredient"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {(() => {
                              const availableIngredients = allIngredients
                                .filter((ing) => ing.supplierId === supplier.id)
                                .filter(
                                  (ing) =>
                                    !requiredIngredients.some(
                                      (i) => i.ingredientId === ing.ingredientId
                                    )
                                )
                                .filter(
                                  (ing) =>
                                    !additionalIngredients.some(
                                      (ai) =>
                                        ai.ingredientId === ing.ingredientId &&
                                        ai.supplierId === supplier.id
                                    )
                                );
                              return availableIngredients.map((ingredient) => (
                                <SelectItem
                                  key={ingredient.ingredientId}
                                  value={ingredient.ingredientId.toString()}
                                >
                                  {ingredient.name}
                                </SelectItem>
                              ));
                            })()}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          className="w-24"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              supplier.id,
                              item.ingredientId,
                              parseFloat(e.target.value)
                            )
                          }
                        />
                        <span className="text-sm text-muted-foreground">
                          {
                            allIngredients.find(
                              (i) => i.ingredientId === item.ingredientId
                            )?.unit
                          }
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIngredient(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Additional suppliers section */}
      {additionalSuppliers.length > 0 && (
        <>
          <div className="mt-8 mb-4">
            <h2 className="text-lg font-semibold">Additional Suppliers</h2>
          </div>
          {additionalSuppliers.map((supplierId) => {
            const supplier = suppliers.find((s) => s.id === supplierId)!;
            return (
              <Card key={supplierId}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CardTitle>{supplier.name}</CardTitle>
                      <Badge variant="outline">Additional</Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addIngredient(supplierId)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Ingredient
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {additionalIngredients
                      .filter((item) => item.supplierId === supplierId)
                      .map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-4 border rounded-lg"
                        >
                          <div className="flex-1">
                            <Select
                              value={
                                item.ingredientId
                                  ? item.ingredientId.toString()
                                  : ""
                              }
                              onValueChange={(value) => {
                                const ingredientId = parseInt(value);
                                if (!isNaN(ingredientId)) {
                                  handleIngredientSelect(
                                    supplierId,
                                    ingredientId
                                  );
                                  handleQuantityChange(
                                    supplierId,
                                    ingredientId,
                                    0
                                  );
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select ingredient">
                                  {item.ingredientId
                                    ? allIngredients.find(
                                        (i) =>
                                          i.ingredientId === item.ingredientId
                                      )?.name
                                    : "Select ingredient"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {(() => {
                                  const availableIngredients = allIngredients
                                    .filter(
                                      (ing) => ing.supplierId === supplierId
                                    )
                                    .filter(
                                      (ing) =>
                                        !additionalIngredients.some(
                                          (ai) =>
                                            ai.ingredientId ===
                                              ing.ingredientId &&
                                            ai.supplierId === supplierId
                                        )
                                    );
                                  return availableIngredients.map(
                                    (ingredient) => (
                                      <SelectItem
                                        key={ingredient.ingredientId}
                                        value={ingredient.ingredientId.toString()}
                                      >
                                        {ingredient.name}
                                      </SelectItem>
                                    )
                                  );
                                })()}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              className="w-24"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  supplierId,
                                  item.ingredientId,
                                  parseFloat(e.target.value)
                                )
                              }
                            />
                            <span className="text-sm text-muted-foreground">
                              {
                                allIngredients.find(
                                  (i) => i.ingredientId === item.ingredientId
                                )?.unit
                              }
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeIngredient(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </>
      )}

      {/* Add supplier button */}
      <div className="flex justify-end">
        <Select
          key={supplierSelectKey}
          onValueChange={(value) => {
            const supplierId = parseInt(value);
            if (!allSupplierIds.includes(supplierId)) {
              setAdditionalSuppliers([...additionalSuppliers, supplierId]);
              setSupplierSelectKey((prev) => prev + 1);
            }
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Add supplier" />
          </SelectTrigger>
          <SelectContent>
            {suppliers
              .filter((s) => !allSupplierIds.includes(s.id))
              .map((supplier) => (
                <SelectItem key={supplier.id} value={supplier.id.toString()}>
                  {supplier.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Create Supplier Orders
        </Button>
      </div>
    </div>
  );
}
