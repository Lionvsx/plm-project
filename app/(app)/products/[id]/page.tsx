import { getProduct } from "@/controllers/products";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, formatPercentage } from "@/lib/utils";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { FormulationsList } from "./_components/formulations";

interface Props {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(parseInt(params.id));

  if (!product) {
    notFound();
  }

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Cost Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(product.costPrice)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(product.margin)}
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
                  <CardTitle>{variant.size}</CardTitle>
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

        {/* Formulations Section */}
        <FormulationsList productId={product.id} formulations={product.formulations} />
      </div>
    </div>
  );
}
