"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { updateOrder } from "@/controllers/orders";
import type { Order } from "@/db/schema";
import type { OrderIngredientNeeds } from "@/controllers/orders";
import { AlertTriangle } from "lucide-react";

interface LaunchProductionFormProps {
  order: Order;
  ingredientNeeds: OrderIngredientNeeds[];
}

export function LaunchProductionForm({
  order,
  ingredientNeeds,
}: LaunchProductionFormProps) {
  const router = useRouter();
  const hasInsufficientStock = ingredientNeeds.some(
    (need) => need.isStockCritical
  );
  const hasBelowMinimumWarning = ingredientNeeds.some(
    (need) =>
      !need.isStockCritical &&
      need.availableStock - need.totalQuantity < need.minimumStock
  );

  return (
    <div className="space-y-4">
      {hasBelowMinimumWarning && (
        <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 p-4 rounded-lg">
          <AlertTriangle className="h-5 w-5" />
          <p>
            Some ingredients will be below minimum stock levels after production
          </p>
        </div>
      )}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button
          onClick={async () => {
            try {
              await updateOrder(order.id, {
                ...order,
                status: "IN_PRODUCTION",
              });
              router.push("/orders");
              router.refresh();
            } catch (error) {
              console.error("Error launching production:", error);
            }
          }}
          disabled={hasInsufficientStock}
          className="bg-yellow-500 hover:bg-yellow-600 text-white"
        >
          {hasInsufficientStock
            ? "Insufficient Stock"
            : "Confirm Production Launch"}
        </Button>
      </div>
    </div>
  );
}
