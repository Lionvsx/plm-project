import { users } from "@/db/schema/users";

export const usersSeeding = [
  {
    email: "admin@admin.fr",
    password: "admin",
    role: "ADMIN",
  },
] satisfies (typeof users.$inferInsert)[];
