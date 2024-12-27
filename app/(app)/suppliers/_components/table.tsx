// app/(app)/suppliers/_components/table.tsx
"use client";

import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getSuppliers } from "@/controllers/ingredients";
import { ColumnDef } from "@tanstack/react-table";

type Supplier = Awaited<ReturnType<typeof getSuppliers>>[number];

interface SuppliersTableProps {
  suppliers: Supplier[];
}

export const SuppliersTable = ({ suppliers }: SuppliersTableProps) => {
  const columns: ColumnDef<Supplier>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return (
          <Link
            href={`/suppliers/${row.original.id}`}
            className="hover:underline"
          >
            {row.getValue("name")}
          </Link>
        );
      },
    },
    {
      accessorKey: "contactPerson",
      header: "Contact Person",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      id: "ingredients",
      header: "Ingredients",
      cell: ({ row }) => {
        const supplier = row.original;
        return supplier.ingredients?.length || 0;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const supplier = row.original;
        return (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/suppliers/${supplier.id}`}>View</Link>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={suppliers}
      filterColumn="name"
      searchPlaceholder="Search suppliers..."
      onRowClick={(row) => {
        window.location.href = `/suppliers/${row.id}`;
      }}
    />
  );
};
