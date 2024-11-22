"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormulaFormValues, formulaSchema } from "@/lib/validators/formula";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createFormula, updateFormula } from "../actions";

interface FormulaFormProps {
  initialValues?: {
    id?: number;
    name: string;
    description: string | null;
    notes?: string | null;
  };
}

export function FormulaForm({ initialValues }: FormulaFormProps) {
  const form = useForm<FormulaFormValues>({
    resolver: zodResolver(formulaSchema),
    defaultValues: initialValues ? {
      name: initialValues.name,
      description: initialValues.description ?? "",
      notes: initialValues.notes ?? "",
    } : {
      name: "",
      description: "",
      notes: "",
    },
  });

  const onSubmit = async (data: FormulaFormValues) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      if (!initialValues?.id) {
        await createFormula(formData);
        toast.success("Formula created successfully");
      } else {
        await updateFormula(initialValues.id, formData);
        toast.success("Formula updated successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {initialValues?.id ? "Update Formula" : "Create Formula"}
        </Button>
      </form>
    </Form>
  );
} 