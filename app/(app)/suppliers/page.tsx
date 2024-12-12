import { getSuppliers } from "@/controllers/ingredients";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function SuppliersPage() {
  const suppliers = await getSuppliers();

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "contactPerson",
      header: "Contact Person",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      id: "ingredients",
      header: "Ingredients",
      cell: ({ row }) => {
        const supplier = row.original;
        return supplier.ingredients?.length || 0;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const supplier = row.original;
        return (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/app/suppliers/${supplier.id}`}>View</Link>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Suppliers</h1>
        <Button asChild>
          <Link href="/app/suppliers/new">
            <Plus className="w-4 h-4 mr-2" />
            New Supplier
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={suppliers}
        searchKey="name"
        searchPlaceholder="Search suppliers..."
      />
    </div>
  );
}
