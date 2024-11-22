"use client";

import React from "react";
import { AppHeader } from "@/components/app-header";
import { FormulaVariantForm } from "@/app/(app)/formulation/_components/formula-variant-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFormula } from "@/controllers/formulas";

export default async function NewFormulaVersionPage({
  params,
}: {
  params: { formulaId: string };
}) {
  const formula = await getFormula(Number(params.formulaId));

  if (!formula) {
    return <div>Formula not found</div>;
  }

  return (
    <div>
      <AppHeader
        items={[
          { label: "Formulation", href: "/formulation" },
          { label: formula.name, href: `/formulation/${formula.id}` },
          { label: "New Version", href: `/formulation/${formula.id}/versions/new` },
        ]}
      />
      <div className="p-4 pt-0 flex justify-center items-center h-full">
        <Card className="max-w-xl w-full">
          <CardHeader>
            <CardTitle>New Formula Version</CardTitle>
          </CardHeader>
          <CardContent>
            <FormulaVariantForm 
              formulaId={formula.id}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 