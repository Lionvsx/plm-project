"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { UnitDisplay } from "@/components/unit-display";
import { deleteFormulationIngredient } from "@/controllers/formulations";
import { FormulationIngredient } from "@/db/schema";
import { Unit } from "@/lib/constants/units";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const handleDelete = async (id: number) => {
    try {
      await deleteFormulationIngredient(id);
      router.refresh();
    } catch (error) {
      console.error("Error deleting ingredient:", error);
    }
  };
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
    {
      id: "actions",
      cell: ({ row }) => {
        const ingredient = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(ingredient.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                router.push(
                  `/ingredients/${ingredient.ingredient.id}/edit`
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
