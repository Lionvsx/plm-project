import { getProductVariants } from "@/controllers/products";
import { OrderForm } from "../_components/form";

export default async function NewOrderPage() {
  const productVariants = await getProductVariants();

  console.log("Product variants pour le formulaire:", productVariants);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Nouvelle Commande</h1>
        <p className="text-muted-foreground mt-2">
          Créer une nouvelle commande avec les produits sélectionnés.
        </p>
      </div>

      <div className="max-w-2xl">
        <OrderForm productVariants={productVariants} />
      </div>
    </div>
  );
}
