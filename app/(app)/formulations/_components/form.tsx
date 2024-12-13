"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { useRouter } from "next/navigation";
import { createFormulation, updateFormulation } from "@/controllers/formulations";
import { Formulation } from "@/db/schema";
import { formulationSchema } from "@/lib/validators/formulation";

interface FormProps {
  initialData?: Formulation;
  productVariantId: number;
}

export function FormulationForm({ initialData, productVariantId }: FormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formulationSchema>>({
    resolver: zodResolver(formulationSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      version: initialData?.version || 1,
      productVariantId: initialData?.productVariantId || productVariantId,
      notes: initialData?.notes || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formulationSchema>) {
    try {
      if (initialData) {
        await updateFormulation(initialData.id, values);
      } else {
        await createFormulation(values);
      }
      router.push("/formulations");
      router.refresh();
    } catch (error) {
      console.error("Error saving formulation:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Formulation name" {...field} />
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
                <Textarea
                  placeholder="Description of the formulation"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="version"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Version</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 1" {...field} />
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
                <Textarea
                  placeholder="Additional notes"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {initialData ? "Update Formulation" : "Create Formulation"}
        </Button>
      </form>
    </Form>
  );
}
