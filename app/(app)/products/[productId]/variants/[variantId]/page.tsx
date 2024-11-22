import { DeleteVariantButton } from "@/app/(app)/products/_components/delete-variant-button";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getVariant } from "@/controllers/product-variants";
import { getProduct } from "@/controllers/products";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";

export default async function VariantPage({
  params,
}: {
  params: { productId: string; variantId: string };
}) {
  const [product, variant] = await Promise.all([
    getProduct(Number(params.productId)),
    getVariant(Number(params.variantId)),
  ]);

  if (!product || !variant) {
    return <div>Not found</div>;
  }

  return (
    <div>
      <AppHeader
        items={[
          { label: "Products", href: "/products" },
          { label: product.name, href: `/products/${product.id}` },
          { label: variant.sku ?? "VAR" + variant.id, href: `/products/${product.id}/variants/${variant.id}` },
        ]}
      >
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/products/${product.id}/variants/${variant.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <DeleteVariantButton
            variantId={variant.id}
            productId={product.id}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DeleteVariantButton>
        </div>
      </AppHeader>
      <div className="p-4 pt-0">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Variant Details</CardTitle>
            <CardDescription>
              Details for variant {variant.sku}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Size</h3>
                <p className="text-lg font-medium">{variant.size}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">SKU</h3>
                <p className="text-lg font-medium">{variant.sku}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Price</h3>
                <p className="text-lg font-medium">${Number(variant.price).toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              This variant belongs to product: {product.name}
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
