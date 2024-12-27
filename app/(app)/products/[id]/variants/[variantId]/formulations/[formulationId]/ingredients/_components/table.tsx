"use client";

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { FormulationIngredient } from "@/db/schema";
import { formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { deleteFormulationIngredient } from "@/controllers/formulations";
import { useRouter } from "next/navigation";

interface TableProps {
  data: (FormulationIngredient & {
    ingredient: {
      name: string;
      unit: string;
      costPerUnit: string;
    };
  })[];
  formulationId: number;
}

export function IngredientsTable({ data, formulationId }: TableProps) {
  const router = useRouter();

  const handleDelete = async (id: number) => {
    try {
      await deleteFormulationIngredient(id);
      router.refresh();
    } catch (error) {
      console.error("Error deleting ingredient:", error);
    }
  };

  const columns: ColumnDef<TableProps["data"][0]>[] = [
    {
      accessorKey: "ingredient.name",
      header: "Ingredient",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => {
        const quantity = row.getValue("quantity") as string;
        const unit = row.original.unit;
        return `${formatNumber(quantity)} ${unit}`;
      },
    },
    {
      id: "cost",
      header: "Cost",
      cell: ({ row }) => {
        const quantity = parseFloat(row.original.quantity);
        const costPerUnit = parseFloat(row.original.ingredient.costPerUnit);
        const totalCost = quantity * costPerUnit;
        return `$${formatNumber(totalCost)}`;
      },
    },
    {
      accessorKey: "notes",
      header: "Notes",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const formulationIngredient = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(formulationIngredient.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                router.push(
                  `/ingredients/${formulationIngredient.ingredientId}/edit`
                )
              }
            >
              <Pencil className="h-4 w-4" />
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
      filterColumn="ingredient.name"
      searchPlaceholder="Search ingredients..."
    />
  );
}
