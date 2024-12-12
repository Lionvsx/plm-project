import { getFormulations } from "@/controllers/formulations";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Table } from "./_components/table";

export default async function FormulationsPage() {
  const formulations = await getFormulations();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Formulations</h1>
        <Button asChild>
          <Link href="/formulations/new">
            <Plus className="w-4 h-4 mr-2" />
            New Formulation
          </Link>
        </Button>
      </div>

      <Table data={formulations} />
    </div>
  );
}
