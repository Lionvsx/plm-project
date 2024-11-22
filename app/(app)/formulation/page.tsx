import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormulaActions } from "@/app/(app)/formulation/_components/formula-actions";
import { getFormulas } from "@/controllers/formulas";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function FormulationPage() {
  try {
    const formulas = await getFormulas();

    return (
      <div>
        <AppHeader items={[{ label: "Formulation", href: "/formulation" }]}>
          <FormulaActions />
        </AppHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 pt-0">
          {formulas?.map(formula => (
            <div key={formula.id} className="flex flex-col">
              <Card>
                <CardHeader>
                  <CardTitle>{formula.name}</CardTitle>
                  {formula.description && (
                    <CardDescription>{formula.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    {formula.variants?.map(variant => (
                      <div key={variant.id} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Version {variant.version}
                        </span>

                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/formulation/${formula.id}/edit`}>
                      Edit
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={`/formulation/${formula.id}`}>
                      View
                      <ArrowRight className="size-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading formulas:', error);
    return (
      <div className="p-4">
        <p className="text-red-500">Error loading formulas. Please try again later.</p>
      </div>
    );
  }
}
