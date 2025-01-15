export type Permissions = {
  product: {
    action: "create" | "read" | "update" | "delete";
    dataType: { id: number };
  };
  formulation: {
    action: "create" | "read" | "update" | "delete";
    dataType: { id: number };
  };
};

export const ROLES = {
  ADMIN: {
    product: {
      create: true,
      read: true,
      update: true,
      delete: true,
    },
    formulation: {
      create: true,
      read: true,
      update: true,
      delete: true,
    },
  },
  USER: {
    product: {
      create: false,
      read: true,
      update: false,
      delete: false,
    },
    formulation: {
      create: false,
      read: true,
      update: false,
      delete: false,
    },
  },
} as const;
