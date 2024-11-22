import { AppHeader } from "@/components/app-header";
import { ProductForm } from "@/app/(app)/products/_components/product-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProduct } from "@/controllers/products";


export default async function EditProductPage({ params }: { params: { productId: string } }) {
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
          { label: "Edit", href: `/products/${product.id}/edit` }
        ]}
      />
      <div className="p-4 pt-0 flex justify-center items-center h-full">
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Edit Product</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductForm
              initialValues={{
                id: product.id,
                name: product.name,
                description: product.description,
                launchDate: product.launchDate?.toISOString(),
                discontinuationDate: product.discontinuationDate?.toISOString(),
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
