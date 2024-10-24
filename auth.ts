import NextAuth, { type DefaultSession } from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db/database";
import { signInSchema } from "./lib/validators/sign-in";
import { hashPassword } from "./lib/functions/server/password";
import { users } from "./db/schema/users";
import { eq, and } from "drizzle-orm";

declare module "next-auth" {
  interface Session {
    user: {
      /** The user's id. */
      id: string;
      role: "admin" | "supplier" | "production" | "outlet" | "research";
    } & DefaultSession["user"];
  }
}

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [
    GitHub,
    Credentials({
      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const validation = signInSchema.safeParse(credentials);

        if (!validation.success) {
          return null;
        }

        const { email, password } = validation.data;

        const pwHash = await hashPassword(password);

        const user = await db.query.users.findFirst({
          where: and(eq(users.email, email), eq(users.password, pwHash)),
        });

        return user ?? null;
      },
    }),
  ],
  adapter: DrizzleAdapter(db),
  callbacks: {
    jwt({ token, profile }) {
      if (profile) {
        token.id = profile.id;
        token.image = profile.avatar_url || profile.picture;
      }
      return token;
    },
    authorized({ auth }) {
      return !!auth?.user;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
});
