"use client";

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Formulation } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface TableProps {
  data: Formulation[];
}

export function Table({ data }: TableProps) {
  const columns: ColumnDef<Formulation>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "product.name",
      header: "Product",
    },
    {
      accessorKey: "version",
      header: "Version",
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
          <Badge variant={isActive ? "success" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Last Updated",
      cell: ({ row }) => {
        const value = row.getValue("updatedAt") as string;
        return formatDate(value);
      },
    },
    {
      id: "ingredients",
      header: "Ingredients",
      cell: ({ row }) => {
        const formulation = row.original as any;
        return formulation.ingredients?.length || 0;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const formulation = row.original;
        return (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/formulations/${formulation.id}`}>View</Link>
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
      searchPlaceholder="Search formulations..."
    />
  );
}
