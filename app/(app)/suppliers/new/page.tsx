import { getProducts } from "@/controllers/products";
import { SupplierForm } from "../_components/form";

export default async function NewProjectPage() {
  const products = await getProducts();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">New Supplier</h1>
        <p className="text-muted-foreground mt-2">
          Create a new supplier to track development progress.
        </p>
      </div>

      <div className="max-w-2xl">
        <SupplierForm />
      </div>
    </div>
  );
}
