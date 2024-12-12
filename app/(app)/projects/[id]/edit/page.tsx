import { getProject } from "@/controllers/projects";
import { ProjectForm } from "../../_components/form";
import { notFound } from "next/navigation";
import { getProducts } from "@/controllers/products";

interface Props {
  params: {
    id: string;
  };
}

export default async function EditProjectPage({ params }: Props) {
  const project = await getProject(parseInt(params.id));
  const products = await getProducts();

  if (!project) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Project</h1>
        <p className="text-muted-foreground mt-2">
          Make changes to {project.name}.
        </p>
      </div>

      <div className="max-w-2xl">
        <ProjectForm initialData={project} products={products} />
      </div>
    </div>
  );
}
