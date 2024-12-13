"use client";

import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { getTasks } from "@/controllers/projects";

type Task = Awaited<ReturnType<typeof getTasks>>[number];

interface TaskTableProps {
  tasks: Task[];
}

export function TaskTable({ tasks }: TaskTableProps) {
  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variant = {
          TODO: "secondary",
          IN_PROGRESS: "warning",
          REVIEW: "default",
          COMPLETED: "success",
        }[status];

        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      accessorKey: "assignee.name",
      header: "Assigned To",
    },
    {
      accessorKey: "deadline",
      header: "Deadline",
      cell: ({ row }) => {
        const value = row.getValue("deadline");
        return formatDate(value as string);
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={tasks}
      filterColumn="title"
      searchPlaceholder="Search tasks..."
    />
  );
}
