"use server";

import { auth } from "@/auth";
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
