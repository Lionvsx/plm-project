import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProduct } from "@/controllers/products";
import { db } from "@/db";
import { formulation, formulationIngredient, ingredient } from "@/db/schema";
import { formatCurrency, formatDate } from "@/lib/utils";
import { sql } from "drizzle-orm";
import { ArrowRight, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

async function getVariantCosts(variantId: number) {
  'use server'

  const costs = await db
    .select({
      totalCost: sql<number>`
        SUM(
          ${formulationIngredient}.quantity * ${ingredient}.cost_per_unit
        )`.as('total_cost')
    })
    .from(formulationIngredient)
    .innerJoin(formulation, sql`${formulation.id} = ${formulationIngredient.formulationId}`)
    .innerJoin(ingredient, sql`${ingredient.id} = ${formulationIngredient.ingredientId}`)
    .where(sql`${formulation.productVariantId} = ${variantId} AND ${formulation.isActive} = true`)
    .groupBy(formulation.productVariantId);

  return costs[0]?.totalCost ?? 0;
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(parseInt(params.id));
  if (!product) {
    notFound();
  }

  const variantCosts = await Promise.all(
    product.variants.map(v => getVariantCosts(v.id))
  );

  const totalCosts = variantCosts.reduce((sum, cost) => sum + cost, 0);
  const averageCost = variantCosts.length > 0 ? totalCosts / variantCosts.length : 0;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          {product.description && (
            <p className="text-muted-foreground mt-2">{product.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/products/${product.id}/edit`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Average Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(averageCost)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Ingredients Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalCosts)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Launch Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDate(product.launchDate)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {/* Variants Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Variants</h2>
            <Button asChild>
              <Link href={`/products/${product.id}/variants/new`}>
                <Plus className="w-4 h-4 mr-2" />
                New Variant
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.variants.map((variant) => (
              <Card key={variant.id}>
                <CardHeader>
                  <CardTitle>
                    <Link href={`/products/${product.id}/variants/${variant.id}`} className="flex items-center gap-2 hover:underline">
                      {variant.size}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SKU</span>
                      <span>{variant.sku}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price</span>
                      <span>{formatCurrency(variant.price)}</span>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={`/products/${product.id}/variants/${variant.id}/edit`}
                        >
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {product.variants.length === 0 && (
              <Card>
                <CardContent className="text-center text-muted-foreground py-6">
                  No variants found. Create one to get started.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
