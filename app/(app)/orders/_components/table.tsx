"use client";

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { getOrders } from "@/controllers/orders";

type Order = Awaited<ReturnType<typeof getOrders>>[number];

interface TableProps {
  data: Order[];
}

export function Table({ data }: TableProps) {
  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "customerName",
      header: "Client",
      cell: ({ row }) => {
        return (
          <Link href={`/orders/${row.original.id}`} className="hover:underline">
            {row.getValue("customerName")}
          </Link>
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
      header: "Date de livraison",
      cell: ({ row }) => {
        const value = row.getValue("deliveryDate") as Date;
        return value ? formatDate(value) : "-";
      },
    },
    {
      id: "items",
      header: "Produits",
      cell: ({ row }) => {
        return row.original.items?.length || 0;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/orders/${row.original.id}`}>View</Link>
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
      searchPlaceholder="Rechercher une commande..."
      onRowClick={(row) => {
        window.location.href = `/orders/${row.id}`;
      }}
    />
  );
}
