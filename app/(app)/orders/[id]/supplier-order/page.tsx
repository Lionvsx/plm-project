import { getOrder, calculateOrderIngredientNeeds } from "@/controllers/orders";
import { getSuppliers } from "@/controllers/suppliers";
import { getIngredients } from "@/controllers/ingredients";
import { notFound } from "next/navigation";
import { SupplierOrderForm } from "./_components/form";

interface Props {
  params: {
    id: string;
  };
}

export default async function SupplierOrderPage({ params }: Props) {
  const [order, suppliers, allIngredients] = await Promise.all([
    getOrder(parseInt(params.id)),
    getSuppliers(),
    getIngredients(),
  ]);

  if (!order) {
    notFound();
  }

  const needs = await calculateOrderIngredientNeeds(order.id);

  // Group ingredients by supplier and only include suppliers with required ingredients
  const supplierNeeds = suppliers
    .map((supplier) => {
      const ingredients = needs.filter(
        (need) => need.supplierId === supplier.id && need.isStockCritical
      );
      return {
        supplier,
        ingredients: ingredients.map((ing) => ({
          ...ing,
          orderQuantity: Math.max(0, ing.totalQuantity - ing.availableStock),
        })),
      };
    })
    .filter((need) => need.ingredients.length > 0);

  // Get the list of suppliers that have required ingredients
  const requiredSupplierIds = supplierNeeds.map((need) => need.supplier.id);

  // Map ingredients to include supplier information
  const ingredientsWithSuppliers = allIngredients.map((ing) => ({
    ingredientId: ing.id,
    name: ing.name,
    supplierId: ing.supplier?.id,
    unit: ing.unit,
    availableStock: parseFloat(ing.stockQuantity || "0"),
    minimumStock: parseFloat(ing.minimumStock || "0"),
    isStockCritical: false,
    totalQuantity: 0,
  }));

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create Supplier Orders</h1>
        <p className="text-muted-foreground mt-2">
          Order ingredients from suppliers for order #{order.id}
        </p>
      </div>

      <SupplierOrderForm
        orderId={order.id}
        supplierNeeds={supplierNeeds}
        allIngredients={ingredientsWithSuppliers}
        suppliers={suppliers.filter((s) => !requiredSupplierIds.includes(s.id))} // Only pass suppliers that don't have required ingredients
      />
    </div>
  );
}
