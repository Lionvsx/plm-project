"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function DropDatabaseButton() {
    const handleDrop = async () => {
        try {
            const confirmed = window.confirm(
                "⚠️ WARNING: This will delete ALL data from the database. This action cannot be undone. Are you absolutely sure?"
            );

            if (!confirmed) return;

            const doubleConfirmed = window.confirm(
                "🚨 FINAL WARNING: All your data will be permanently deleted. Type 'DELETE' to confirm."
            );

            if (!doubleConfirmed) return;

            const response = await fetch("/api/database/drop", {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Failed to clear database");
            }

            toast.success("Database cleared successfully!");
        } catch (error) {
            console.error("Error clearing database:", error);
            toast.error("Failed to clear database");
        }
    };

    return (
        <Button
            onClick={handleDrop}
            variant="destructive"
            className="gap-2"
        >
            Clear Database
        </Button>
    );
}
