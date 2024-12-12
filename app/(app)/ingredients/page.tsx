import { getIngredients } from "@/controllers/ingredients";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Table } from "./_components/table";

export default async function IngredientsPage() {
  const ingredients = await getIngredients();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Ingredients</h1>
        <Button asChild>
          <Link href="/ingredients/new">
            <Plus className="w-4 h-4 mr-2" />
            New Ingredient
          </Link>
        </Button>
      </div>

      <Table data={ingredients} />
    </div>
  );
}
