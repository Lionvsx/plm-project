"use client";

import { orderSchema } from "@/lib/validators/orders";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
// ... autres imports

export function OrderForm() {
  const form = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      items: [{ productVariantId: "", quantity: 1 }],
    },
  });

  // ... logique du formulaire
}
