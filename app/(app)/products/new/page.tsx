import { ProductForm } from "../_components/form";

export default function NewProductPage() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">New Product</h1>
                <p className="text-muted-foreground mt-2">
                    Create a new product in the catalog.
                </p>
            </div>

            <div className="max-w-2xl">
                <ProductForm />
            </div>
        </div>
    );
}
