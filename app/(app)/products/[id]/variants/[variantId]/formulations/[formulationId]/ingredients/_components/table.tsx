"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { UnitDisplay } from "@/components/unit-display";
import { FormulationIngredient } from "@/db/schema";
import { Unit } from "@/lib/constants/units";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

interface IngredientsTableProps {
  data: (FormulationIngredient & {
    ingredient: {
      id: number;
      name: string;
      unitType: string;
    };
  })[];
  formulationId: number;
}

export function IngredientsTable({ data, formulationId }: IngredientsTableProps) {
  const columns: ColumnDef<IngredientsTableProps["data"][0]>[] = [
    {
      accessorKey: "ingredient.name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Ingredient
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Quantity
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <UnitDisplay
            value={parseFloat(row.original.quantity)}
            unit={row.original.unit as Unit}
          />
        );
      },
    },
    {
      accessorKey: "notes",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Notes
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      filterColumn="ingredient.name"
      searchPlaceholder="Search ingredients..."
    />
  );
}
