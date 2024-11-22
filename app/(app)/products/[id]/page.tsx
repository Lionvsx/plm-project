import { AppHeader } from "@/components/app-header";
import { getProduct } from "@/controllers/products";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Edit, Plus } from "lucide-react";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(Number(params.id));

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <AppHeader
        items={[
          { label: "Products", href: "/products" },
          { label: product.name, href: `/products/${product.id}` }
        ]}
      >
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/products/${product.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/products/${product.id}/variants/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Variant
            </Link>
          </Button>
        </div>
      </AppHeader>
      <div className="p-4 pt-0">
        <Card>
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
            {product.description && (
              <CardDescription>{product.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {product.variants?.map(variant => (
                <Card key={variant.id}>
                  <CardHeader>
                    <CardTitle>{variant.size}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between">
                      <span>SKU: {variant.sku}</span>
                      <span>${Number(variant.price).toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
