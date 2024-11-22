"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { FormulaVariantForm } from "./formula-variant-form";

interface FormulaVariantActionsProps {
  formulaId: number;
}

export function FormulaVariantActions({ formulaId }: FormulaVariantActionsProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Variant
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Formula Variant</DialogTitle>
        </DialogHeader>
        <FormulaVariantForm formulaId={formulaId} />
      </DialogContent>
    </Dialog>
  );
} 