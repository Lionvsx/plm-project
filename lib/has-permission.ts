import { Permissions, ROLES } from "@/constants/permissions";
import { User } from "@/db/schema";
import { RolesWithPermissions } from "@/lib/types";

export function hasPermission<Resource extends keyof Permissions>(
  user: User,
  resource: Resource,
  action: Permissions[Resource]["action"],
  data?: Permissions[Resource]["dataType"]
) {
  const role = user.role;
  const permission = (ROLES as RolesWithPermissions)[role][resource]?.[action];
  if (permission == null) return false;

  if (typeof permission === "boolean") return permission;
  return data != null && permission(user, data);
}
