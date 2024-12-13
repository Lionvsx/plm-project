import { getProduct } from "@/controllers/products";
import { getFormulation } from "@/controllers/formulations";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { NewVersionForm } from "./_components/form";

interface Props {
  params: {
    id: string;
    variantId: string;
    formulationId: string;
  };
}

export default async function EditFormulationPage({ params }: Props) {
  const [product, formulation] = await Promise.all([
    getProduct(parseInt(params.id)),
    getFormulation(parseInt(params.formulationId)),
  ]);

  if (!product || !formulation || formulation.productVariantId !== parseInt(params.variantId)) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">New Version</h1>
        <p className="text-muted-foreground mt-2">
          Create a new version of formulation for {product.name}.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Version (v{formulation.version})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-x-4">
              <div>
                <span className="text-sm text-muted-foreground">Name</span>
                <p className="text-sm font-medium">{formulation.name}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Created</span>
                <p className="text-sm font-medium">{formatDate(formulation.createdAt)}</p>
              </div>
              <div className="mt-2">
                <span className="text-sm text-muted-foreground">Description</span>
                <p className="text-sm font-medium">{formulation.description || "No description"}</p>
              </div>
              <div className="mt-2">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <p className="text-sm font-medium">{formatDate(formulation.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>New Version</CardTitle>
          </CardHeader>
          <CardContent>
            <NewVersionForm
              productId={product.id}
              currentFormulation={formulation}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
