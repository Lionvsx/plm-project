import { getSuppliers } from "@/controllers/ingredients";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Table } from "./_components/table";

export default async function SuppliersPage() {
  const suppliers = await getSuppliers();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Suppliers</h1>
        <Button asChild>
          <Link href="/suppliers/new">
            <Plus className="w-4 h-4 mr-2" />
            New Supplier
          </Link>
        </Button>
      </div>

      <Table data={suppliers} />
    </div>
  );
}
