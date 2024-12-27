import { getSupplier } from "@/controllers/suppliers";
import { SupplierForm } from "../../_components/form";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

export default async function EditSupplierPage({ params }: Props) {
  const supplier = await getSupplier(parseInt(params.id));

  if (!supplier) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Supplier</h1>
        <p className="text-muted-foreground mt-2">
          Modify the supplier details below.
        </p>
      </div>

      <div className="max-w-2xl">
        <SupplierForm initialData={supplier} />
      </div>
    </div>
  );
}
