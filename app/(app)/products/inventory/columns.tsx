"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { InventoryWithDetails } from "@/controllers/inventory";
import { UpdateQuantityCell } from "./update-quantity-cell";
import { format } from "date-fns";

export const columns: ColumnDef<InventoryWithDetails>[] = [
  {
    accessorKey: "product.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "variant.size",
    header: "Size",
  },
  {
    accessorKey: "variant.sku",
    header: "SKU",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => {
      return (
        <UpdateQuantityCell
          inventoryId={row.original.id}
          currentQuantity={row.original.quantity ?? 0}
        />
      );
    },
  },
  {
    accessorKey: "lastUpdated",
    header: "Last Updated",
    cell: ({ row }) => {
      const date = row.original.lastUpdated;
      if (!date) return "Never";
      return format(date, "PPp");
    },
  },
];
