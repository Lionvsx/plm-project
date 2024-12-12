"use client";

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { getProjects } from "@/controllers/projects";

type Project = Awaited<ReturnType<typeof getProjects>>[number];

interface TableProps {
  data: Project[];
}

export function Table({ data }: TableProps) {
  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            variant={
              status === "COMPLETED"
                ? "success"
                : status === "IN_PROGRESS"
                ? "secondary"
                : status === "CANCELLED"
                ? "destructive"
                : undefined
            }
          >
            {status.replace("_", " ")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => {
        const value = row.getValue("startDate") as string;
        return formatDate(value);
      },
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }) => {
        const value = row.getValue("endDate") as string;
        return value ? formatDate(value) : "-";
      },
    },
    {
      id: "tasks",
      header: "Tasks",
      cell: ({ row }) => {
        const project = row.original;
        const completedTasks = project.tasks?.filter(
          (task) => task.status === "COMPLETED"
        ).length;
        const totalTasks = project.tasks?.length || 0;
        return `${completedTasks}/${totalTasks}`;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const project = row.original;
        return (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/projects/${project.id}`}>View</Link>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      filterColumn="name"
      searchPlaceholder="Search projects..."
    />
  );
}
