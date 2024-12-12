import { getProduct } from "@/controllers/products";
import { VariantForm } from "../../../_components/variant-form";
import { notFound } from "next/navigation";

interface Props {
    params: {
        id: string;
    };
}

export default async function NewVariantPage({ params }: Props) {
    const product = await getProduct(parseInt(params.id));

    if (!product) {
        notFound();
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">New Variant</h1>
                <p className="text-muted-foreground mt-2">
                    Add a new variant for {product.name}.
                </p>
            </div>

            <div className="max-w-2xl">
                <VariantForm productId={product.id} />
            </div>
        </div>
    );
}
