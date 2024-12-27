"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function SeedButton() {
  const handleSeed = async () => {
    try {
      const confirmed = window.confirm(
        "This will delete all existing data and seed the database with sample data. Are you sure?"
      );

      if (!confirmed) return;

      const response = await fetch("/api/seed", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to seed database");
      }

      toast.success("Database seeded successfully!");
    } catch (error) {
      console.error("Error seeding database:", error);
      toast.error("Failed to seed database");
    }
  };

  return (
    <Button
      onClick={handleSeed}
      variant="destructive"
      className="gap-2"
    >
      Reset & Seed Database
    </Button>
  );
}
