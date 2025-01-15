import { getSuppliers } from "@/controllers/ingredients";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Table } from "./_components/table";
import { hasPermission } from "@/lib/has-permission";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { User } from "@/db/schema";

export default async function SuppliersPage() {
  const suppliers = await getSuppliers();

  const session = await auth.api.getSession({
    headers: headers(),
  });
  const user = session?.user as User;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Suppliers</h1>
        {hasPermission(user, "suppliers", "create") && (
          <Button asChild>
            <Link href="/suppliers/new">
              <Plus className="w-4 h-4 mr-2" />
              New Supplier
            </Link>
          </Button>
        )}
      </div>

      <Table data={suppliers} />
    </div>
  );
}
