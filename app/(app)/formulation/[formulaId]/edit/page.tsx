import { AppHeader } from "@/components/app-header";
import { FormulaForm } from "@/app/(app)/formulation/_components/formula-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFormula } from "@/controllers/formulas";

export default async function EditFormulaPage({ params }: { params: { formulaId: string } }) {
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
          { label: "Edit", href: `/formulation/${formula.id}/edit` }
        ]}
      />
      <div className="p-4 pt-0 flex justify-center items-center h-full">
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Edit Formula</CardTitle>
          </CardHeader>
          <CardContent>
            <FormulaForm
              initialValues={{
                id: formula.id,
                name: formula.name,
                description: formula.description,
                notes: formula.notes,
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
