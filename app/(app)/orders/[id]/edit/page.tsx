import { getOrder } from "@/controllers/orders";
import { getProductVariants } from "@/controllers/products";
import { OrderForm } from "../../_components/form";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

export default async function EditOrderPage({ params }: Props) {
  const [order, productVariants] = await Promise.all([
    getOrder(parseInt(params.id)),
    getProductVariants(),
  ]);

  if (!order) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Order</h1>
        <p className="text-muted-foreground mt-2">
          Modify the order details below.
        </p>
      </div>

      <div className="max-w-2xl">
        <OrderForm
          initialData={order}
          productVariants={productVariants}
          isEditing
        />
      </div>
    </div>
  );
}
