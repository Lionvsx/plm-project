"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import type { getIngredients } from "@/controllers/ingredients";
import { formatDate, formatNumber } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

type Ingredient = Awaited<ReturnType<typeof getIngredients>>[number];

interface TableProps {
  data: Ingredient[];
}

export function Table({ data }: TableProps) {
  const columns: ColumnDef<Ingredient>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "stockQuantity",
      header: "Stock Level",
      cell: ({ row }) => {
        const stockQuantity =
          parseFloat(row.getValue("stockQuantity") as string) || 0;
        const minimumStock =
          parseFloat(row.original.minimumStock as string) || 0;
        const unit = row.original.unit;

        return (
          <Badge
            variant={
              stockQuantity <= 0
                ? "destructive"
                : stockQuantity < minimumStock
                ? "secondary"
                : "success"
            }
          >
            {formatNumber(stockQuantity)} {unit}
          </Badge>
        );
      },
    },
    {
      accessorKey: "costPerUnit",
      header: "Cost per Unit",
      cell: ({ row }) => {
        const cost = row.getValue("costPerUnit") as string;
        const unit = row.original.unit;
        return `$${formatNumber(cost)}/${unit}`;
      },
    },
    {
      accessorKey: "supplierId",
      header: "Supplier",
      cell: ({ row }) => row.original.supplier?.name || "No supplier",
    },
    {
      accessorKey: "updatedAt",
      header: "Last Updated",
      cell: ({ row }) => {
        const value = row.getValue("updatedAt") as Date;
        return formatDate(value);
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const ingredient = row.original;
        return (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/ingredients/${ingredient.id}`}>View</Link>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      filterColumn="name"
      searchPlaceholder="Search ingredients..."
    />
  );
}
