"use client";

import { Table } from "./table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import type { Ingredient, Supplier } from "@/db/schema";

interface IngredientsClientProps {
  initialIngredients: Array<
    Ingredient & {
      supplier: {
        id: number;
        name: string;
        email: string | null;
        phone: string | null;
        address: string | null;
      } | null;
    }
  >;
  suppliers: Array<{
    id: number;
    name: string;
    email: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    notes: string | null;
    contactPerson: string | null;
    phone: string | null;
    address: string | null;
  }>;
}

export function IngredientsClient({
  initialIngredients,
  suppliers,
}: IngredientsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>("all");

  const filteredIngredients = initialIngredients.filter((ingredient) => {
    const matchesSearch = ingredient.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesSupplier =
      selectedSupplierId === "all" ||
      ingredient.supplierId?.toString() === selectedSupplierId;
    return matchesSearch && matchesSupplier;
  });

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ingredients</h1>
        <Link href="/ingredients/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Ingredient
          </Button>
        </Link>
      </div>

      <div className="flex gap-2">
        <Select
          value={selectedSupplierId}
          onValueChange={setSelectedSupplierId}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by supplier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All suppliers</SelectItem>
            {suppliers.map((supplier) => (
              <SelectItem key={supplier.id} value={supplier.id.toString()}>
                {supplier.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table data={filteredIngredients} />
    </div>
  );
}
