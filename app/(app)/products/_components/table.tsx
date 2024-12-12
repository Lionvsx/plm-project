"use client";

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/db/schema";
import { formatCurrency, formatDate, formatPercentage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface TableProps {
  data: Product[];
}

export function Table({ data }: TableProps) {
  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "costPrice",
      header: "Cost Price",
      cell: ({ row }) => {
        const value = row.getValue("costPrice") as string;
        return formatCurrency(value);
      },
    },
    {
      accessorKey: "margin",
      header: "Margin",
      cell: ({ row }) => {
        const value = row.getValue("margin") as string;
        return formatPercentage(value);
      },
    },
    {
      accessorKey: "launchDate",
      header: "Launch Date",
      cell: ({ row }) => {
        const value = row.getValue("launchDate") as string;
        return formatDate(value);
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/products/${product.id}`}>View</Link>
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
      searchPlaceholder="Search products..."
    />
  );
}
