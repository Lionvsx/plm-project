import { getProducts } from "@/controllers/products";
import { getProjects, getProjectProgress } from "@/controllers/projects";
import { getLowStockIngredients } from "@/controllers/ingredients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default async function DashboardPage() {
  const [products, projects, lowStockIngredients] = await Promise.all([
    getProducts(),
    getProjects(),
    getLowStockIngredients(),
  ]);

  const activeProjects = projects.filter(
    (project) => project.status === "ACTIVE"
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Products Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{products.length}</p>
              <p className="text-sm text-muted-foreground">Total Products</p>
            </div>
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-2xl font-bold">{activeProjects.length}</p>
                <p className="text-sm text-muted-foreground">
                  of {projects.length} Total Projects
                </p>
              </div>
              <div className="space-y-2">
                {activeProjects.slice(0, 3).map(async (project) => {
                  const progress = await getProjectProgress(project.id);
                  return (
                    <div key={project.id} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{project.name}</span>
                        <span>{progress?.progress.toFixed(0)}%</span>
                      </div>
                      <Progress value={progress?.progress} />
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-2xl font-bold">{lowStockIngredients.length}</p>
              <div className="space-y-2">
                {lowStockIngredients.slice(0, 3).map((ingredient) => (
                  <div
                    key={ingredient.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <span>{ingredient.name}</span>
                    <span className="text-red-500">
                      {ingredient.stockQuantity} {ingredient.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
