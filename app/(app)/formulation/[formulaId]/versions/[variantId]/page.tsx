"use client";

import React from "react";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getVariant } from "@/controllers/formula-variants";
import { getFormula } from "@/controllers/formulas";
import { Edit } from "lucide-react";
import Link from "next/link";
import { FormulaVariantActions } from "@/app/(app)/formulation/_components/formula-variant-actions";

export default async function FormulaVersionPage({
  params,
}: {
  params: { formulaId: string; variantId: string };
}) {
  const [formula, variant] = await Promise.all([
    getFormula(Number(params.formulaId)),
    getVariant(Number(params.variantId)),
  ]);

  if (!formula || !variant) {
    return <div>Not found</div>;
  }

  return (
    <div>
      <AppHeader
        items={[
          { label: "Formulation", href: "/formulation" },
          { label: formula.name, href: `/formulation/${formula.id}` },
          { label: `Version ${variant.version}`, href: `/formulation/${formula.id}/versions/${variant.id}` },
        ]}
      >
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/formulation/${formula.id}/versions/${variant.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <FormulaVariantActions 
            formulaId={formula.id}
          />
        </div>
      </AppHeader>
      <div className="p-4 pt-0">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Formula Version Details</CardTitle>
            <CardDescription>
              Version {variant.version}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Version</h3>
                <p className="text-lg font-medium">{variant.version}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                <p className="text-lg font-medium">{variant.notes}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              This version belongs to formula: {formula.name}
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 