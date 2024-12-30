import { getOrder, calculateOrderIngredientNeeds } from "@/controllers/orders";
import { getSuppliers } from "@/controllers/suppliers";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { SupplierOrderForm } from "@/app/(app)/orders/[id]/supplier-order/_components/form";

interface Props {
  params: {
    id: string;
  };
}

export default async function SupplierOrderPage({ params }: Props) {
  const [order, ingredientNeeds, suppliers] = await Promise.all([
    getOrder(parseInt(params.id)),
    calculateOrderIngredientNeeds(parseInt(params.id)),
    getSuppliers(),
  ]);

  if (!order) {
    notFound();
  }

  // Group ingredients by supplier
  const supplierNeeds = suppliers
    .map((supplier) => {
      const ingredients = ingredientNeeds.filter(
        (need) => need.isStockCritical && need.supplierId === supplier.id
      );
      return {
        supplier,
        ingredients: ingredients.map((need) => ({
          ...need,
          orderQuantity: need.totalQuantity - need.availableStock, // Calculate minimum order quantity
        })),
      };
    })
    .filter((supplierNeed) => supplierNeed.ingredients.length > 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Order from Suppliers</h1>
          <p className="text-muted-foreground mt-2">
            Order required ingredients for Order #{order.id}
          </p>
        </div>
        <Badge variant="secondary" className="text-lg">
          Order #{order.id}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <div className="font-medium">{order.customerName}</div>
              <div className="text-sm text-muted-foreground">
                {order.customerEmail || "No email provided"}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery Date:</span>
              <span>
                {order.deliveryDate ? formatDate(order.deliveryDate) : "-"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Missing Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ingredientNeeds.filter((need) => need.isStockCritical).length}
            </div>
            <p className="text-sm text-muted-foreground">
              ingredients need to be ordered
            </p>
          </CardContent>
        </Card>
      </div>

      <SupplierOrderForm
        orderId={order.id}
        supplierNeeds={supplierNeeds}
        allIngredients={ingredientNeeds}
        suppliers={suppliers}
      />
    </div>
  );
}
