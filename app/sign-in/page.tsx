import { LoginForm } from "@/components/login-form";
import { redirect } from "next/navigation";
import { getServerSession } from "@/controllers/auth";

export default async function SignInPage() {
  const session = await getServerSession()

  if (session?.user) {
    return redirect("/dashboard");
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <LoginForm />
    </div>
  );
}
