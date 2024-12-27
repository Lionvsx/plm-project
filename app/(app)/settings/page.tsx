import { SeedButton } from "@/components/seed-button";
import { DropDatabaseButton } from "@/components/drop-database-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function AdminPage() {
  return (
    <div className="container py-6 px-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Database Management</CardTitle>
            <CardDescription>
              Manage your database data and perform maintenance operations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-8">
              <div>
                <h3 className="font-medium mb-2">Reset & Seed Database</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This will delete all existing data and populate the database with sample data.
                  Use this only in development or when you want to reset to a known state.
                </p>
                <SeedButton />
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2 text-destructive">Clear Database</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  ⚠️ This will permanently delete ALL data from the database.
                  This action cannot be undone. Use with extreme caution.
                </p>
                <DropDatabaseButton />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
