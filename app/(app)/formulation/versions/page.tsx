import { AppHeader } from "@/components/app-header";
import { getVariants } from "@/controllers/product-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function ProductPage() {
  const productVariants = await getVariants();

  return (
    <div>
      <AppHeader items={[{ label: "Products", href: "/products" }, { label: "Variants", href: `/products/variants` }]} >
      </AppHeader>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {productVariants.map(variant => (
            <Card key={variant.id}>
              <CardHeader>
                <Link
                  href={`/products/${variant.productId}`}
                  className="text-sm text-muted-foreground hover:underline"
                >
                  {variant.product?.name}
                </Link>
                <CardTitle className="text-lg">{variant.size}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">SKU</span>
                    <span>{variant.sku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Price</span>
                    <span className="font-medium">${Number(variant.price).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
