import { getProduct } from "@/controllers/products";
import { getProjects } from "@/controllers/projects";
import { notFound } from "next/navigation";
import { ProductForm } from "../../_components/form";

interface Props {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: Props) {
  const product = await getProduct(parseInt(params.id));
  const projects = await getProjects();

  if (!product) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground mt-2">
          Make changes to {product.name}.
        </p>
      </div>

      <div className="max-w-2xl">
        <ProductForm initialData={product} projects={projects} />
      </div>
    </div>
  );
}
