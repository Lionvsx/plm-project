import { IngredientForm } from "../_components/form";
import { getSuppliers } from "@/controllers/suppliers";

export default async function NewIngredientPage() {
  const suppliers = await getSuppliers();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">New Ingredient</h1>
        <p className="text-muted-foreground mt-2">
          Add a new ingredient to the system.
        </p>
      </div>

      <div className="max-w-2xl">
        <IngredientForm suppliers={suppliers} />
      </div>
    </div>
  );
}
