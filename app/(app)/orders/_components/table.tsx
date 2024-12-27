"use client";

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { getOrders } from "@/controllers/orders";
import { Pencil } from "lucide-react";

type Order = Awaited<ReturnType<typeof getOrders>>[number];

interface TableProps {
  data: Order[];
}

export function Table({ data }: TableProps) {
  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "customerName",
      header: "Customer",
      cell: ({ row }) => {
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <Link
              href={`/orders/${row.original.id}`}
              className="hover:underline"
            >
              {row.getValue("customerName")}
            </Link>
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

        return <Badge variant={variant as any}>{status}</Badge>;
      },
    },
    {
      accessorKey: "deliveryDate",
      header: "Delivery Date",
      cell: ({ row }) => {
        const value = row.getValue("deliveryDate") as Date;
        return value ? formatDate(value) : "-";
      },
    },
    {
      id: "items",
      header: "Products",
      cell: ({ row }) => {
        return row.original.items?.length || 0;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/orders/${row.original.id}/edit`}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Link>
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
      filterColumn="customerName"
      searchPlaceholder="Search for an order..."
      onRowClick={(row) => {
        window.location.href = `/orders/${row.id}`;
      }}
    />
  );
}
