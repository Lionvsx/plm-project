import { auth } from "@/auth";
import { LoginButton } from "@/components/login-button";

export default async function SignInPage() {
    const session = await auth();

    if (session?.user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen py-2">
                <h1 className="text-4xl font-bold mb-4">Welcome back!</h1>
                <p className="mb-4">You are already signed in as {session.user.name}</p>
                <LoginButton />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl font-bold mb-4">Sign In</h1>
            <LoginButton />
        </div>
    );
}
