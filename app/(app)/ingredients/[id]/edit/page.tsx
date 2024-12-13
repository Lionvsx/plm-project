import { getIngredient, getSuppliers } from "@/controllers/ingredients";
import { IngredientForm } from "../../_components/form";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

export default async function EditIngredientPage({ params }: Props) {
  const ingredient = await getIngredient(parseInt(params.id));
  const suppliers = await getSuppliers();
  if (!ingredient) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Ingredient</h1>
        <p className="text-muted-foreground mt-2">
          Make changes to {ingredient.name}.
        </p>
      </div>

      <div className="max-w-2xl">
        <IngredientForm initialData={ingredient} suppliers={suppliers} />
      </div>
    </div>
  );
}
