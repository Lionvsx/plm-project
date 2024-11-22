"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { HTMLAttributes, useState } from "react";
import { toast } from "sonner";
import { deleteVariant } from "../actions";

interface DeleteVariantButtonProps extends HTMLAttributes<HTMLButtonElement> {
  variantId: number;
  productId: number;
  size?: "sm" | "icon" | "lg";
}

export function DeleteVariantButton({ children, className, variantId, productId, size, ...props }: DeleteVariantButtonProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteVariant(variantId, productId);
      toast.success("Variant deleted successfully");
      router.push(`/products/${productId}`);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" {...props} className={cn(className)} size={size}>
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Variant</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this variant? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
