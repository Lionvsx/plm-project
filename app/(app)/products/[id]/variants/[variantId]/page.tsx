import { getProduct } from "@/controllers/products";
import { notFound } from "next/navigation";
import { FormulationsList } from "../../_components/formulations";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { BOMGenerator } from "@/components/bom-generator";
import { Unit } from "@/lib/constants/units";

interface Props {
  params: {
    id: string;
    variantId: string;
  };
}

export default async function VariantPage({ params }: Props) {
  const product = await getProduct(parseInt(params.id));

  if (!product) {
    notFound();
  }

  const variant = product.variants.find(
    (v) => v.id === parseInt(params.variantId)
  );

  if (!variant) {
    notFound();
  }

  // Find the latest active formulation
  const activeFormulation = variant.formulations
    .filter((f) => f.isActive)
    .sort((a, b) => b.version - a.version)[0];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Variant {variant.sku}</h1>
          <p className="text-muted-foreground mt-2">
            Product variant for {product.name}
          </p>
        </div>
        <div className="flex gap-2">
          {activeFormulation && (
            <BOMGenerator
              productName={product.name}
              variantSku={variant.sku || ""}
              formulationName={activeFormulation.name || "Untitled"}
              ingredients={activeFormulation.ingredients.map((i) => ({
                name: i.ingredient.name,
                quantity: i.quantity,
                unit: i.unit as Unit,
                costPerUnit: i.ingredient.costPerUnit,
              }))}
            />
          )}
          <Button asChild>
            <Link href={`/products/${product.id}/variants/${variant.id}/edit`}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Variant
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <p className="text-sm font-medium">SKU</p>
            <p>{variant.sku}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Size</p>
            <p>{variant.size}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Price</p>
            <p>{variant.price}</p>
          </div>
        </div>

        <FormulationsList
          productId={product.id}
          productVariantId={variant.id}
          formulations={variant.formulations}
        />
      </div>
    </div>
  );
}
