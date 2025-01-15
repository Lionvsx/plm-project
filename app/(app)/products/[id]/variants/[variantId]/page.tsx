import { getProduct } from "@/controllers/products";
import { notFound } from "next/navigation";
import { FormulationsList } from "../../_components/formulations";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pencil, FileDown } from "lucide-react";
import { BOMGenerator } from "@/components/bom-generator";
import { Unit } from "@/lib/constants/units";
import { hasPermission } from "@/lib/has-permission";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { User } from "@/db/schema";

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

  const session = await auth.api.getSession({
    headers: headers(),
  });
  const user = session?.user as User;

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

  // Calculate total fabrication cost if there's an active formulation
  const fabricationCost = activeFormulation
    ? activeFormulation.ingredients.reduce((sum, item) => {
      const cost =
        parseFloat(item.quantity) * parseFloat(item.ingredient.costPerUnit);
      return sum + cost;
    }, 0)
    : 0;

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
          {activeFormulation && hasPermission(user, "products", "manage_formulations") && (
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
          {hasPermission(user, "products", "update") && (
            <Button asChild>
              <Link
                href={`/products/${product.id}/variants/${variant.id}/edit`}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit Variant
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">SKU</p>
            <p>{variant.sku}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Size</p>
            <p>{variant.size}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Fabrication Cost</p>
            <p>${fabricationCost.toFixed(2)}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Price</p>
            <p>${variant.price}</p>
          </div>
        </div>

        {variant.cadFileUrl && (
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium mb-3">Technical Documents</h3>
            <a
              href={variant.cadFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:bg-accent p-3 rounded-md transition-colors"
            >
              <div className="bg-blue-100 p-2 rounded-md">
                <FileDown className="h-5 w-5 text-blue-700" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">CAD File</span>
                <span className="text-sm text-muted-foreground">
                  {variant.cadFileUrl.split('/').pop()}
                </span>
              </div>
            </a>
          </div>
        )}

        <FormulationsList
          productId={product.id}
          productVariantId={variant.id}
          formulations={variant.formulations}
          canCreate={hasPermission(user, "products", "create")}
          canUpdate={hasPermission(user, "products", "update")}
        />
      </div>
    </div>
  );
}
