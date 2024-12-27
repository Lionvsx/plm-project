import { getProduct } from "@/controllers/products";
import { getFormulation } from "@/controllers/formulations";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  params: {
    id: string;
    variantId: string;
    formulationId: string;
  };
}

export default async function FormulationPage({ params }: Props) {
  const [product, formulation] = await Promise.all([
    getProduct(parseInt(params.id)),
    getFormulation(parseInt(params.formulationId)),
  ]);

  if (!product || !formulation || formulation.productVariantId !== parseInt(params.variantId)) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{formulation.name}</h1>
            <Badge variant={formulation.isActive ? "success" : "secondary"}>
              {formulation.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          {formulation.description && (
            <p className="text-muted-foreground mt-2">
              {formulation.description}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link
              href={`/products/${product.id}/variants/${params.variantId}/formulations/${formulation.id}/edit`}
            >
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Version</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">v{formulation.version}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Created</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDate(formulation.createdAt)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDate(formulation.updatedAt)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ingredients Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Ingredients</h2>
          <Button asChild>
            <Link
              href={`/products/${product.id}/variants/${params.variantId}/formulations/${formulation.id}/ingredients/new`}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit Formulation Ingredients
            </Link>
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formulation.ingredients.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.ingredient.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>
                  ${(parseFloat(item.quantity) * parseFloat(item.ingredient.costPerUnit)).toFixed(2)}
                </TableCell>
                <TableCell>{item.notes}</TableCell>
              </TableRow>
            ))}
            {formulation.ingredients.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  No ingredients added. Add one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {formulation.notes && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{formulation.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
