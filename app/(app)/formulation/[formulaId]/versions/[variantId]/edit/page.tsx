"use client";

import React from "react";
import { AppHeader } from "@/components/app-header";
import { FormulaVariantForm } from "@/app/(app)/formulation/_components/formula-variant-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFormula } from "@/controllers/formulas";
import { getVariant } from "@/controllers/formula-variants";

export default async function EditFormulaVersionPage({
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
          { label: "Edit Version", href: `/formulation/${formula.id}/versions/${variant.id}/edit` },
        ]}
      />
      <div className="p-4 pt-0 flex justify-center items-center h-full">
        <Card className="max-w-xl w-full">
          <CardHeader>
            <CardTitle>Edit Formula Version</CardTitle>
          </CardHeader>
          <CardContent>
            <FormulaVariantForm
              formulaId={formula.id}
              initialValues={{
                id: variant.id,
                version: variant.version ?? 1,
                notes: variant.notes ?? "",
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 