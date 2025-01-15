import { User } from "@/db/schema";
import { RolesWithPermissions } from "@/lib/types";

export type Permissions = {
  "admin-dashboard": {
    dataType: void;
    action: "view";
  };
  products: {
    dataType: void;
    action:
      | "view"
      | "create"
      | "update"
      | "delete"
      | "manage_variants"
      | "manage_formulations";
  };
  projects: {
    dataType: void;
    action: "view" | "create" | "update" | "delete" | "manage";
  };
  suppliers: {
    dataType: void;
    action: "view" | "create" | "update" | "delete";
  };
  formulations: {
    dataType: void;
    action: "view" | "create" | "update" | "version" | "manage_ingredients";
  };
  users: {
    dataType: User;
    action: "view" | "update" | "view_all" | "delete" | "manage";
  };
  ingredients: {
    dataType: void;
    action: "view" | "create" | "update" | "delete";
  };
};

export const ROLES = {
  admin: {
    "admin-dashboard": {
      view: true,
    },
    products: {
      view: true,
      create: true,
      update: true,
      delete: true,
      manage_variants: true,
      manage_formulations: true,
    },
    projects: {
      view: true,
      create: true,
      update: true,
      delete: true,
      manage: true,
    },
    suppliers: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
    formulations: {
      view: true,
      create: true,
      update: true,
      version: true,
      manage_ingredients: true,
    },
    users: {
      view: true,
      update: true,
      view_all: true,
      delete: true,
      manage: true,
    },
    ingredients: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
  },
  product_manager: {
    "admin-dashboard": {
      view: false,
    },
    products: {
      view: true,
      create: true,
      update: true,
      delete: false,
      manage_variants: true,
      manage_formulations: true,
    },
    projects: {
      view: true,
      create: true,
      update: true,
      delete: false,
      manage: true,
    },
    suppliers: {
      view: true,
      create: false,
      update: false,
      delete: false,
    },
    formulations: {
      view: true,
      create: true,
      update: true,
      version: true,
      manage_ingredients: true,
    },
    users: {
      view: true,
      update: (user: User, otherUser: User) => user.id === otherUser.id,
      view_all: false,
      delete: false,
      manage: false,
    },
    ingredients: {
      view: true,
      create: true,
      update: true,
      delete: false,
    },
  },
  procurement: {
    "admin-dashboard": {
      view: false,
    },
    products: {
      view: true,
      create: false,
      update: false,
      delete: false,
      manage_variants: false,
      manage_formulations: false,
    },
    projects: {
      view: true,
      create: false,
      update: false,
      delete: false,
      manage: false,
    },
    suppliers: {
      view: true,
      create: true,
      update: true,
      delete: false,
    },
    formulations: {
      view: true,
      create: false,
      update: false,
      version: false,
      manage_ingredients: true,
    },
    users: {
      view: true,
      update: (user: User, otherUser: User) => user.id === otherUser.id,
      view_all: false,
      delete: false,
      manage: false,
    },
    ingredients: {
      view: true,
      create: false,
      update: false,
      delete: false,
    },
  },
  project_manager: {
    "admin-dashboard": {
      view: false,
    },
    products: {
      view: true,
      create: false,
      update: true,
      delete: false,
      manage_variants: false,
      manage_formulations: false,
    },
    projects: {
      view: true,
      create: true,
      update: true,
      delete: false,
      manage: true,
    },
    suppliers: {
      view: true,
      create: false,
      update: false,
      delete: false,
    },
    formulations: {
      view: true,
      create: false,
      update: false,
      version: false,
      manage_ingredients: false,
    },
    users: {
      view: true,
      update: (user: User, otherUser: User) => user.id === otherUser.id,
      view_all: false,
      delete: false,
      manage: false,
    },
    ingredients: {
      view: true,
      create: false,
      update: false,
      delete: false,
    },
  },
  sales_representative: {
    "admin-dashboard": {
      view: false,
    },
    products: {
      view: true,
      create: false,
      update: false,
      delete: false,
      manage_variants: false,
      manage_formulations: false,
    },
    projects: {
      view: true,
      create: false,
      update: false,
      delete: false,
      manage: false,
    },
    suppliers: {
      view: true,
      create: false,
      update: false,
      delete: false,
    },
    formulations: {
      view: false,
      create: false,
      update: false,
      version: false,
      manage_ingredients: false,
    },
    users: {
      view: true,
      update: (user: User, otherUser: User) => user.id === otherUser.id,
      view_all: false,
      delete: false,
      manage: false,
    },
    ingredients: {
      view: true,
      create: false,
      update: false,
      delete: false,
    },
  },
  viewer: {
    "admin-dashboard": {
      view: false,
    },
    products: {
      view: true,
      create: false,
      update: false,
      delete: false,
      manage_variants: false,
      manage_formulations: false,
    },
    projects: {
      view: true,
      create: false,
      update: false,
      delete: false,
      manage: false,
    },
    suppliers: {
      view: true,
      create: false,
      update: false,
      delete: false,
    },
    formulations: {
      view: true,
      create: false,
      update: false,
      version: false,
      manage_ingredients: false,
    },
    users: {
      view: true,
      update: (user: User, otherUser: User) => user.id === otherUser.id,
      view_all: false,
      delete: false,
      manage: false,
    },
    ingredients: {
      view: true,
      create: false,
      update: false,
      delete: false,
    },
  },
} as const satisfies RolesWithPermissions;
