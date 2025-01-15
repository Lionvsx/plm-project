import { User } from "@/db/schema";
import { RolesWithPermissions } from "@/lib/types";

export type Permissions = {
  "admin-dashboard": {
    dataType: void;
    action: "view";
  };
  users: {
    dataType: User;
    action: "view" | "update" | "view_all" | "delete" | "manage";
  };
  whitelist: {
    dataType: string;
    action: "view" | "add" | "delete";
  };
  waitlist: {
    dataType: string;
    action: "view" | "add" | "delete";
  };
};

export const ROLES = {
  admin: {
    "admin-dashboard": {
      view: true,
    },
    users: {
      view: true,
      update: true,
      view_all: true,
      delete: true,
      manage: true,
    },
    whitelist: {
      view: true,
      add: true,
      delete: true,
    },
    waitlist: {
      view: true,
      add: true,
      delete: true,
    },
  },
  user: {
    "admin-dashboard": {
      view: false,
    },
    users: {
      view: true,
      update: (user, otherUser) => user.id === otherUser.id,
      view_all: false,
      delete: (user, otherUser) => user.id === otherUser.id,
      manage: false,
    },
    whitelist: {
      view: false,
      add: false,
      delete: false,
    },
    waitlist: {
      view: true,
      add: false,
      delete: (user, email) => user.email === email,
    },
  },
} as const satisfies RolesWithPermissions;
