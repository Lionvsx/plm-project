import { AppHeader } from "@/components/app-header";
import { getInventoryItems } from "@/controllers/inventory";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function InventoryPage() {
  const rawInventory = await getInventoryItems();
  const inventory = rawInventory.map(item => ({
    ...item,
    lastUpdated: item.lastUpdated ? new Date(item.lastUpdated) : null,
    variant: {
      ...item.variant,
      size: item.variant.size ?? '',
      sku: item.variant.sku ?? '',
      price: item.variant.price ?? ''
    }
  }));

  return (
    <div>
      <AppHeader items={[{ label: "Inventory", href: "/inventory" }]} />
      <div className="p-4 pt-0">
        <h1 className="text-2xl font-bold mb-4 ml-1">Inventory Table</h1>
        <DataTable columns={columns} data={inventory} />
      </div>
    </div>
  );
}
