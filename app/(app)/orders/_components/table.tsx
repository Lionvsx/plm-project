"use client";

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { getOrders } from "@/controllers/orders";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  calculateOrderIngredientNeeds,
  updateOrder,
  type OrderIngredientNeeds,
} from "@/controllers/orders";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { User } from "@/db/schema";
import { hasPermission } from "@/lib/has-permission";

type Order = Awaited<ReturnType<typeof getOrders>>[number];

interface TableProps {
  data: Order[];
  user: User;
}

export function Table({ data, user }: TableProps) {
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [ingredientNeeds, setIngredientNeeds] = useState<
    OrderIngredientNeeds[]
  >([]);
  const [showNeedsDialog, setShowNeedsDialog] = useState(false);

  const handleStatusChange = async (order: Order, newStatus: string) => {
    try {
      if (newStatus === "IN_PRODUCTION") {
        const needs = await calculateOrderIngredientNeeds(order.id);
        setIngredientNeeds(needs);
        setSelectedOrder(order);
        setShowNeedsDialog(true);
        return;
      }

      await updateOrder(order.id, { ...order, status: newStatus });
      router.refresh();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleCancel = async () => {
    if (!selectedOrder) return;

    try {
      await updateOrder(selectedOrder.id, {
        ...selectedOrder,
        status: "CANCELLED",
      });
      setShowCancelDialog(false);
      setSelectedOrder(null);
      router.refresh();
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  const confirmProductionChange = async () => {
    if (!selectedOrder) return;

    try {
      await updateOrder(selectedOrder.id, {
        ...selectedOrder,
        status: "IN_PRODUCTION",
      });
      setShowNeedsDialog(false);
      setSelectedOrder(null);
      router.refresh();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const statusOptions = [
    { label: "Pending", value: "PENDING" },
    { label: "In Production", value: "IN_PRODUCTION" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Cancelled", value: "CANCELLED" },
  ];

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "customerName",
      header: "Customer",
      cell: ({ row }) => {
        return (
          <div
            className="flex items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              href={`/orders/${row.original.id}`}
              className="font-medium hover:underline"
            >
              {row.getValue("customerName")}
            </Link>
            <div className="ml-2 text-sm text-muted-foreground">
              {row.original.customerEmail}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variant = {
          PENDING: "secondary",
          IN_PRODUCTION: "warning",
          COMPLETED: "success",
          CANCELLED: "destructive",
        }[status];

        const label = {
          PENDING: "Pending",
          IN_PRODUCTION: "In Production",
          COMPLETED: "Completed",
          CANCELLED: "Cancelled",
        }[status];

        return <Badge variant={variant as any}>{label}</Badge>;
      },
    },
    {
      accessorKey: "deliveryDate",
      header: "Delivery Date",
      cell: ({ row }) => {
        const value = row.getValue("deliveryDate") as Date;
        if (!value) return "-";

        const date = new Date(value);
        const today = new Date();
        const isLate = date < today;

        return (
          <div className={isLate ? "text-destructive" : ""}>
            {formatDate(value)}
          </div>
        );
      },
    },
    {
      id: "items",
      header: "Products",
      cell: ({ row }) => {
        const count = row.original.items?.length || 0;
        return <div className="text-center font-medium">{count}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original;
        const canUpdate = hasPermission(user, "orders", "update");

        return (
          <div
            className="flex justify-end gap-2 pr-4"
            onClick={(e) => e.stopPropagation()}
          >
            {order.status === "PENDING" && canUpdate && (
              <>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white min-w-[140px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/orders/${order.id}/launch-production`);
                  }}
                >
                  Launch Production
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedOrder(order);
                    setShowCancelDialog(true);
                  }}
                >
                  Cancel
                </Button>
              </>
            )}
            {order.status === "IN_PRODUCTION" && canUpdate && (
              <>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white min-w-[140px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(order, "COMPLETED");
                  }}
                >
                  Complete
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedOrder(order);
                    setShowCancelDialog(true);
                  }}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        filterColumn="customerName"
        searchPlaceholder="Search for an order..."
        statusColumn="status"
        statusOptions={statusOptions}
        onRowClick={(row) => {
          window.location.href = `/orders/${row.id}`;
        }}
      />

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep order</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, cancel order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
