"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUserRole } from "@/controllers/auth";
import { Role, ROLES } from "@/db/schema";
import { toast } from "sonner";

interface RoleSelectProps {
  userId: string;
  currentRole: Role;
}

export function RoleSelect({ userId, currentRole }: RoleSelectProps) {
  const handleRoleChange = async (newRole: Role) => {
    try {
      await updateUserRole(userId, newRole);
      toast.success("User role updated successfully");
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  return (
    <Select defaultValue={currentRole} onValueChange={handleRoleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ROLES.map((role) => (
          <SelectItem key={role} value={role}>
            {role.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
