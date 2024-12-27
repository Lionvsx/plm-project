import { SeedButton } from "@/components/seed-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="font-medium mb-2">Reset & Seed Database</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This will delete all existing data and populate the database with sample data.
                  Use this only in development or when you want to reset to a known state.
                </p>
                <SeedButton />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
