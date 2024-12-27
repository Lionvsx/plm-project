import { getIngredient } from "@/controllers/ingredients";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatNumber } from "@/lib/utils";
import Link from "next/link";
import { Pencil } from "lucide-react";

interface Props {
  params: {
    id: string;
  };
}

export default async function IngredientPage({ params }: Props) {
  const ingredient = await getIngredient(parseInt(params.id));

  if (!ingredient) {
    notFound();
  }

  const isLowStock =
    ingredient.minimumStock &&
    parseFloat(ingredient.stockQuantity || "0") <=
      parseFloat(ingredient.minimumStock || "0");

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{ingredient.name}</h1>
            {isLowStock && <Badge variant="destructive">Low Stock</Badge>}
          </div>
          {ingredient.description && (
            <p className="text-muted-foreground mt-2">
              {ingredient.description}
            </p>
          )}
        </div>
        <Button variant="outline" size="icon" asChild>
          <Link href={`/ingredients/${ingredient.id}/edit`}>
            <Pencil className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Cost per Unit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(ingredient.costPerUnit)}/{ingredient.unit}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(ingredient.stockQuantity)} {ingredient.unit}
            </div>
            {ingredient.minimumStock && (
              <p className="text-sm text-muted-foreground mt-1">
                Minimum: {formatNumber(ingredient.minimumStock)}{" "}
                {ingredient.unit}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supplier</CardTitle>
          </CardHeader>
          <CardContent>
            {ingredient.supplier ? (
              <>
                <Link
                  href={`/suppliers/${ingredient.supplier.id}`}
                  className="text-2xl font-bold hover:underline"
                >
                  {ingredient.supplier.name}
                </Link>
                {ingredient.supplier.email && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Contact: {ingredient.supplier.email}
                  </p>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">No supplier assigned</p>
            )}
          </CardContent>
        </Card>
      </div>

      {ingredient.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{ingredient.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
