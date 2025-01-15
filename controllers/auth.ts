"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { Role, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const getServerSession = async () => {
  return await auth.api.getSession({
    headers: headers(),
  });
};

export const signOut = async () => {
  await auth.api.signOut({
    headers: headers(),
  });
  return redirect("/sign-in");
};

export const getUsers = async () => {
  return await db.query.user.findMany();
};

export async function updateUserRole(userId: string, role: Role) {
  const result = await db
    .update(user)
    .set({
      role,
      updatedAt: new Date(),
    })
    .where(eq(user.id, userId))
    .returning();

  revalidatePath("/users");
  return result[0];
}
