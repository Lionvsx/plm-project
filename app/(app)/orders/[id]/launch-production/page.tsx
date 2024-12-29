import { getOrder } from "@/controllers/orders";
import { calculateOrderIngredientNeeds } from "@/controllers/orders";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatCurrency } from "@/lib/utils";
import { LaunchProductionForm } from "./_components/form";

interface Props {
  params: {
    id: string;
  };
}

export default async function LaunchProductionPage({ params }: Props) {
  const [order, ingredientNeeds] = await Promise.all([
    getOrder(parseInt(params.id)),
    calculateOrderIngredientNeeds(parseInt(params.id)),
  ]);

  if (!order || order.status !== "PENDING") {
    notFound();
  }

  const totalAmount = order.items.reduce(
    (sum, item) => sum + parseFloat(item.unitPrice) * item.quantity,
    0
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Launch Production</h1>
          <p className="text-muted-foreground mt-2">
            Review order details and confirm production start
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
              <div className="text-sm text-muted-foreground">
                {order.customerPhone || "No phone provided"}
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
              <span className="text-muted-foreground">Created:</span>
              <span>{formatDate(order.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery Date:</span>
              <span>
                {order.deliveryDate ? formatDate(order.deliveryDate) : "-"}
              </span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total Amount:</span>
              <span>{formatCurrency(totalAmount.toString())}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Production Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {ingredientNeeds.some((need) => need.isStockCritical) ? (
                <div className="text-destructive font-medium">
                  Insufficient stock for some ingredients
                </div>
              ) : (
                <div className="text-green-600 font-medium">
                  All ingredients available
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                {ingredientNeeds.length} ingredients needed
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Product</th>
                  <th className="px-4 py-2 text-right">Unit Price</th>
                  <th className="px-4 py-2 text-right">Quantity</th>
                  <th className="px-4 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="px-4 py-2">
                      {item.productVariant?.product?.name || "N/A"} -{" "}
                      {item.productVariant?.size || "N/A"}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="px-4 py-2 text-right">{item.quantity}</td>
                    <td className="px-4 py-2 text-right">
                      {formatCurrency(
                        (parseFloat(item.unitPrice) * item.quantity).toString()
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Required Ingredients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ingredientNeeds.map((need) => {
              const remainingStock = need.availableStock - need.totalQuantity;
              const willBeBelowMinimum = remainingStock < need.minimumStock;

              return (
                <div
                  key={need.ingredientId}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{need.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Required: {need.totalQuantity} {need.unit}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Minimum Stock: {need.minimumStock} {need.unit}
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge
                      variant={
                        need.isStockCritical ? "destructive" : "secondary"
                      }
                    >
                      Available: {need.availableStock} {need.unit}
                    </Badge>
                    {need.isStockCritical ? (
                      <p className="text-xs text-destructive">
                        Missing: {need.totalQuantity - need.availableStock}{" "}
                        {need.unit}
                      </p>
                    ) : willBeBelowMinimum ? (
                      <p className="text-xs text-yellow-600">
                        Will be below minimum ({remainingStock} {need.unit}{" "}
                        remaining)
                      </p>
                    ) : (
                      <p className="text-xs text-green-600">
                        Stock sufficient ({remainingStock} {need.unit}{" "}
                        remaining)
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <LaunchProductionForm order={order} ingredientNeeds={ingredientNeeds} />
    </div>
  );
}
