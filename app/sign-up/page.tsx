import { SignUpForm } from "@/components/signup-form";
import { getServerSession } from "@/controllers/auth";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const session = await getServerSession()

  if (session?.user) {
    redirect("/dashboard")
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <SignUpForm />
    </div>
  );
}
