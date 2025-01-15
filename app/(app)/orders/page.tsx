import { getOrders } from "@/controllers/orders";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Table } from "./_components/table";
import { hasPermission } from "@/lib/has-permission";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { User } from "@/db/schema";

export default async function OrdersPage() {
  const orders = await getOrders();

  const session = await auth.api.getSession({
    headers: headers(),
  });
  const user = session?.user as User;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        {hasPermission(user, "orders", "create") && (
          <Button asChild>
            <Link href="/orders/new">
              <Plus className="w-4 h-4 mr-2" />
              New Order
            </Link>
          </Button>
        )}
      </div>

      <Table data={orders} user={user} />
    </div>
  );
}
