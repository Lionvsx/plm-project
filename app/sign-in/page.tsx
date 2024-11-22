import { LoginForm } from "@/components/login-form";
import { getServerSession } from "@/controllers/auth";

export default async function SignInPage() {
  const session = await getServerSession()

  if (session?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold mb-4">Welcome back!</h1>
        <p className="mb-4">You are already signed in as {session.user.name}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <LoginForm />
    </div>
  );
}
