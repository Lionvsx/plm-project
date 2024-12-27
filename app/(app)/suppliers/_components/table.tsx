// app/(app)/suppliers/_components/table.tsx
"use client";

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { getSuppliers } from "@/controllers/suppliers";
import { Pencil } from "lucide-react";

type Supplier = Awaited<ReturnType<typeof getSuppliers>>[number];

interface TableProps {
  data: Supplier[];
}

export function Table({ data }: TableProps) {
  const columns: ColumnDef<Supplier>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <Link
              href={`/suppliers/${row.original.id}`}
              className="hover:underline"
            >
              {row.getValue("name")}
            </Link>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => row.getValue("phone") || "-",
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => row.getValue("address") || "-",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div
            className="flex gap-2"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `/suppliers/${row.original.id}/edit`;
            }}
          >
            <Button variant="ghost" size="sm">
              <Pencil className="h-4 w-4 mr-2" />
              Edit
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
      searchPlaceholder="Search suppliers..."
      onRowClick={(row) => {
        window.location.href = `/suppliers/${row.id}`;
      }}
    />
  );
}
