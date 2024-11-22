import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductActions } from "@/app/(app)/products/_components/product-actions";
import { getProducts } from "@/controllers/products";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <AppHeader items={[{ label: "Products", href: "/products" }]}>
        <ProductActions />
      </AppHeader>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 pt-0">
        {products.map(product => (
          <div key={product.id} className="flex flex-col">
            <Card>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                {product.description && (
                  <CardDescription>{product.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  {product.variants?.map(variant => (
                    <div key={variant.id} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {variant.size} - {variant.sku}
                      </span>
                      <span className="font-medium">
                        ${Number(variant.price).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/products/${product.id}/edit`}>
                    Edit
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href={`/products/${product.id}`}>
                    View
                    <ArrowRight className="size-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
