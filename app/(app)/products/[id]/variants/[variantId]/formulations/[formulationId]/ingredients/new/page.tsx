import { getProduct } from "@/controllers/products";
import { getFormulation } from "@/controllers/formulations";
import { getIngredients } from "@/controllers/ingredients";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { IngredientForm } from "../_components/form";
import { IngredientsTable } from "../_components/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  params: {
    id: string;
    variantId: string;
    formulationId: string;
  };
}

export default async function NewFormulationIngredientPage({ params }: Props) {
  const [product, formulation, ingredients] = await Promise.all([
    getProduct(parseInt(params.id)),
    getFormulation(parseInt(params.formulationId)),
    getIngredients(),
  ]);

  if (!product || !formulation || formulation.productVariantId !== parseInt(params.variantId)) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add Ingredient</h1>
        <p className="text-muted-foreground mt-2">
          Add a new ingredient to formulation {formulation.name} (v{formulation.version}).
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Formulation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-x-4">
              <div>
                <span className="text-sm text-muted-foreground">Name</span>
                <p className="text-sm font-medium">{formulation.name}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Version</span>
                <p className="text-sm font-medium">v{formulation.version}</p>
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
            <CardTitle>Current Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <IngredientsTable
              data={formulation.ingredients}
              formulationId={formulation.id}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Ingredient</CardTitle>
          </CardHeader>
          <CardContent>
            <IngredientForm
              formulationId={formulation.id}
              ingredients={ingredients}
            />
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-start mt-6 px-6">
        <Button
          asChild
        >
          <Link href={`/products/${params.id}/variants/${params.variantId}/formulations/${params.formulationId}`}>
            Back to Formulation
          </Link>
        </Button>
      </div>
    </div>
  );
}
