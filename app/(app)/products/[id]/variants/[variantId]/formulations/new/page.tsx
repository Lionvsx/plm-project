import { getProduct } from "@/controllers/products";
import { FormulationForm } from "../_components/form";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
    variantId: string;
  };
}

export default async function NewFormulationPage({ params }: Props) {
  const product = await getProduct(parseInt(params.id));

  if (!product) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">New Formulation</h1>
        <p className="text-muted-foreground mt-2">
          Create a new formulation for {product.name}.
        </p>
      </div>

      <div className="max-w-2xl">
        <FormulationForm productId={product.id} productVariantId={parseInt(params.variantId)} />
      </div>
    </div>
  );
}
