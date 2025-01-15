"use client";

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { RoleSelect } from "./role-select";

interface UserTableProps {
  users: User[];
}

export function UserTable({ users }: UserTableProps) {
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        return (
          <RoleSelect
            userId={row.original.id}
            currentRole={row.original.role}
          />
        );
      },
    },
    {
      accessorKey: "emailVerified",
      header: "Email Verification",
      cell: ({ row }) => {
        const verified = row.getValue("emailVerified");
        return (
          <Badge variant={verified ? "success" : "secondary"}>
            {verified ? "Verified" : "Pending"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => formatDate(row.getValue("createdAt")),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={users}
      filterColumn="email"
      searchPlaceholder="Search users..."
    />
  );
}
