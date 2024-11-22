import { AppHeader } from "@/components/app-header";
import { getFormula } from "@/controllers/formulas";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Edit, Plus } from "lucide-react";

export default async function FormulaPage({ params }: { params: { formulaId: string } }) {
  const formula = await getFormula(Number(params.formulaId));

  if (!formula) {
    return <div>Formula not found</div>;
  }

  return (
    <div>
      <AppHeader
        items={[
          { label: "Formulation", href: "/formulation" },
          { label: formula.name, href: `/formulation/${formula.id}` }
        ]}
      >
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/formulation/${formula.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/formulation/${formula.id}/versions/new`}>
              <Plus className="mr-2 h-4 w-4" />
              New Version
            </Link>
          </Button>
        </div>
      </AppHeader>
      <div className="p-4 pt-0">
        <Card>
          <CardHeader>
            <CardTitle>{formula.name}</CardTitle>
            {formula.description && (
              <CardDescription>{formula.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {formula.variants?.map(variant => (
                <Card key={variant.id}>
                  <CardHeader>
                    <CardTitle>Version {variant.version}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    
                    <div className="mt-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/formulation/${formula.id}/variants/${variant.id}`}>
                          View Version
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
