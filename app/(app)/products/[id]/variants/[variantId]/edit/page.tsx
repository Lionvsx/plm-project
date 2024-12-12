import { getProduct } from "@/controllers/products";
import { VariantForm } from "../../../../_components/variant-form";
import { notFound } from "next/navigation";

interface Props {
    params: {
        id: string;
        variantId: string;
    };
}

export default async function EditVariantPage({ params }: Props) {
    const product = await getProduct(parseInt(params.id));

    if (!product) {
        notFound();
    }

    const variant = product.variants.find(
        (v) => v.id === parseInt(params.variantId)
    );

    if (!variant) {
        notFound();
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Edit Variant</h1>
                <p className="text-muted-foreground mt-2">
                    Edit variant {variant.sku} for {product.name}.
                </p>
            </div>

            <div className="max-w-2xl">
                <VariantForm productId={product.id} initialData={variant} />
            </div>
        </div>
    );
}
