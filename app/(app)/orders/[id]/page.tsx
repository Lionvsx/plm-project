import { getOrder } from "@/controllers/orders";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { FC } from "react";

interface Props {
  params: {
    id: string;
  };
}

const OrderPage: FC<Props> = async ({ params }) => {
  const order = await getOrder(parseInt(params.id));

  if (!order) {
    notFound();
  }

  const statusVariant = {
    PENDING: "secondary",
    IN_PRODUCTION: "warning",
    COMPLETED: "success",
    CANCELLED: "destructive",
  } as const;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Order #{order.id}</h1>
            <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
          </div>
          <p className="text-muted-foreground mt-2">
            Customer: {order.customerName}
          </p>
        </div>
        <Button variant="outline" size="icon" asChild>
          <Link href={`/orders/${order.id}/edit`}>
            <Pencil className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Email: {order.customerEmail || "-"}</p>
              <p>Phone: {order.customerPhone || "-"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Created at: {formatDate(order.createdAt)}</p>
              <p>
                Delivery date:{" "}
                {order.deliveryDate ? formatDate(order.deliveryDate) : "-"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Ordered Products</h2>
        <div className="border rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2 text-left">Size</th>
                <th className="px-4 py-2 text-right">Unit Price</th>
                <th className="px-4 py-2 text-right">Quantity</th>
                <th className="px-4 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="px-4 py-2">
                    {item.productVariant?.product?.name || "N/A"}
                  </td>
                  <td className="px-4 py-2">
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
              <tr className="font-bold">
                <td colSpan={4} className="px-4 py-2 text-right">
                  Total
                </td>
                <td className="px-4 py-2 text-right">
                  {formatCurrency(
                    order.items
                      .reduce(
                        (sum, item) =>
                          sum + parseFloat(item.unitPrice) * item.quantity,
                        0
                      )
                      .toString()
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {order.notes && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Notes</h3>
            <p className="text-muted-foreground">{order.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
