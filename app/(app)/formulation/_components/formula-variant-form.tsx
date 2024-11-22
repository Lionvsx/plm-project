"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createVariant, updateVariant } from "../actions";
import { useRouter } from "next/navigation";

interface FormulaVariantFormProps {
  formulaId: number;
  initialValues?: {
    id?: number;
    version: number;
    status: string;
    notes?: string | null;
    ingredients?: string | null;
  };
}

export function FormulaVariantForm({ formulaId, initialValues }: FormulaVariantFormProps) {
  const router = useRouter();
  const isEditing = !!initialValues?.id;

  async function onSubmit(formData: FormData) {
    if (isEditing && initialValues.id) {
      await updateVariant(formulaId, initialValues.id, formData);
    } else {
      await createVariant(formulaId, formData);
    }
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="version" className="text-sm font-medium">Version Number</label>
        <Input
          id="version"
          name="version"
          type="number"
          defaultValue={initialValues?.version}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="status" className="text-sm font-medium">Status</label>
        <Input
          id="status"
          name="status"
          defaultValue={initialValues?.status}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="ingredients" className="text-sm font-medium">Ingredients</label>
        <Textarea
          id="ingredients"
          name="ingredients"
          defaultValue={initialValues?.ingredients || ""}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium">Notes</label>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={initialValues?.notes || ""}
        />
      </div>

      <Button type="submit">
        {isEditing ? "Update Version" : "Create Version"}
      </Button>
    </form>
  );
} 