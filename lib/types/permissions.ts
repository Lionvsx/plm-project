import { Permissions } from "@/constants/permissions";
import { Role } from "@/db/schema";

export type RolesWithPermissions = {
  [K in Role]: {
    [Resource in keyof Permissions]?: {
      [Action in Permissions[Resource]["action"]]?:
        | boolean
        | ((user: any, data: any) => boolean);
    };
  };
};
