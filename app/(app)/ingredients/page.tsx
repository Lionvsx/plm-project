import { getIngredients } from "@/controllers/ingredients";
import { getSuppliers } from "@/controllers/suppliers";
import { IngredientsClient } from "@/app/(app)/ingredients/_components/client";
export default async function IngredientsPage() {
  const [ingredients, suppliers] = await Promise.all([
    getIngredients(),
    getSuppliers(),
  ]);

  return (
    <IngredientsClient initialIngredients={ingredients} suppliers={suppliers} />
  );
}
