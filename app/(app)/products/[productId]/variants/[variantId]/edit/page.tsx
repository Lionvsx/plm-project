import { AppHeader } from "@/components/app-header";
import { VariantForm } from "@/app/(app)/products/_components/variant-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProduct } from "@/controllers/products";
import { getVariant } from "@/controllers/product-variants";

export default async function EditVariantPage({
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
          { label: "Edit Variant", href: `/products/${product.id}/variants/${variant.id}/edit` },
        ]}
      />
      <div className="p-4 pt-0 flex justify-center items-center h-full">
        <Card className="max-w-xl w-full">
          <CardHeader>
            <CardTitle>Edit Variant</CardTitle>
          </CardHeader>
          <CardContent>
            <VariantForm
              productId={product.id}
              initialValues={{
                id: variant.id,
                size: variant.size,
                sku: variant.sku,
                price: variant.price,
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
