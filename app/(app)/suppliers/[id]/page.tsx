import { getSupplier } from "@/controllers/ingredients";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

export default async function SupplierPage({ params }: Props) {
  const supplier = await getSupplier(parseInt(params.id));

  if (!supplier) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{supplier.name}</h1>
          {supplier.email && (
            <p className="text-muted-foreground mt-2">{supplier.email}</p>
          )}
        </div>
        <Button asChild>
          <Link href={`/suppliers/${supplier.id}/edit`}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit Supplier
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <dl className="space-y-4">
              {supplier.contactPerson && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Contact Person
                  </dt>
                  <dd className="mt-1">{supplier.contactPerson}</dd>
                </div>
              )}
              {supplier.phone && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Phone
                  </dt>
                  <dd className="mt-1">{supplier.phone}</dd>
                </div>
              )}
              {supplier.email && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Email
                  </dt>
                  <dd className="mt-1">{supplier.email}</dd>
                </div>
              )}
              {supplier.address && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Address
                  </dt>
                  <dd className="mt-1 whitespace-pre-line">
                    {supplier.address}
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Additional Details</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Created
                </dt>
                <dd className="mt-1">
                  {supplier.createdAt
                    ? new Date(supplier.createdAt).toLocaleDateString()
                    : "N/A"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Last Updated
                </dt>
                <dd className="mt-1">
                  {supplier.updatedAt
                    ? new Date(supplier.updatedAt).toLocaleDateString()
                    : "N/A"}
                </dd>
              </div>
              {supplier.notes && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Notes
                  </dt>
                  <dd className="mt-1 whitespace-pre-line">{supplier.notes}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
