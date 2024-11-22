import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getProduct } from "@/controllers/products";
import { Edit, Plus } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "../_components/product-card";

export default async function ProductPage({ params }: { params: { productId: string } }) {
  const product = await getProduct(Number(params.productId));

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
      <div className="p-4 pt-0 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
            {product.description && (
              <CardDescription>{product.description}</CardDescription>
            )}
          </CardHeader>
        </Card>

        {product.variants && product.variants.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Product Variants</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {product.variants.map(variant => (
                <ProductCard
                  key={variant.id}
                  variant={variant}
                  productId={product.id}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
