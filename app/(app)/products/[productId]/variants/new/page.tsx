import { AppHeader } from "@/components/app-header";
import { VariantForm } from "@/app/(app)/products/_components/variant-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProduct } from "@/controllers/products";

export default async function NewVariantPage({
  params,
}: {
  params: { productId: string };
}) {
  const product = await getProduct(Number(params.productId));

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <AppHeader
        items={[
          { label: "Products", href: "/products" },
          { label: product.name, href: `/products/${product.id}` },
          { label: "New Variant", href: `/products/${product.id}/variants/new` },
        ]}
      />
      <div className="p-4 pt-0 flex justify-center items-center h-full">
        <Card className="max-w-xl w-full">
          <CardHeader>
            <CardTitle>New Variant</CardTitle>
          </CardHeader>
          <CardContent>
            <VariantForm productId={product.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
