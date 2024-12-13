import {
  getProject as getProjectFn,
  getProjectProgress,
} from "@/controllers/projects";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { TaskTable } from "../_components/task-table";

interface Props {
  params: {
    id: string;
  };
}

export default async function ProjectPage({ params }: Props) {
  const project = await getProjectFn(parseInt(params.id));
  const progress = await getProjectProgress(parseInt(params.id));

  if (!project) {
    notFound();
  }

  const statusVariant: Record<
    string,
    "secondary" | "success" | "warning" | "default"
  > = {
    TODO: "secondary",
    IN_PROGRESS: "warning",
    REVIEW: "default",
    COMPLETED: "success",
  } as const;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <Badge variant={statusVariant[project.status]}>
              {project.status}
            </Badge>
          </div>
          {project.description && (
            <p className="text-muted-foreground mt-2">{project.description}</p>
          )}
        </div>
        <Button variant="outline" size="icon" asChild>
          <Link href={`/app/projects/${project.id}/edit`}>
            <Pencil className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDate(project.startDate)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {project.endDate
                ? `Until ${formatDate(project.endDate)}`
                : "No end date"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-2xl font-bold">
                  {progress?.progress.toFixed(0)}%
                </span>
                <span className="text-muted-foreground">
                  {progress?.completedTasks} / {progress?.totalTasks} tasks
                </span>
              </div>
              <Progress value={progress?.progress} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Tasks</h2>
          <Button asChild>
            <Link href={`/projects/${project.id}/tasks/new`}>
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Link>
          </Button>
        </div>

        <TaskTable tasks={project.tasks} />
      </div>
    </div>
  );
}
