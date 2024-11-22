"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateInventoryQuantity } from "@/controllers/inventory";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UpdateQuantityCellProps {
  inventoryId: number;
  currentQuantity: number;
}

export function UpdateQuantityCell({
  inventoryId,
  currentQuantity,
}: UpdateQuantityCellProps) {
  const [quantity, setQuantity] = useState(currentQuantity);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const handleUpdate = async () => {
    try {
      await updateInventoryQuantity(inventoryId, quantity);
      setIsEditing(false);
      toast.success("Quantity updated successfully");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update quantity");
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-20"
          min={0}
        />
        <Button size="sm" onClick={handleUpdate}>
          Save
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span>{quantity}</span>
      <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
        Edit
      </Button>
    </div>
  );
}
