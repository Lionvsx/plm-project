"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Product } from "@/db/schema";
import { formatDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

interface TableProps {
  data: Product[];
}

export function Table({ data }: TableProps) {
  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return (
          <Link
            href={`/products/${row.original.id}`}
            className="hover:underline"
          >
            {row.getValue("name")}
          </Link>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
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
      onRowClick={(row) => {
        window.location.href = `/products/${row.id}`;
      }}
    />
  );
}
