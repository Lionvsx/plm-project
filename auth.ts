import NextAuth, { type DefaultSession } from "next-auth";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db/database";

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
  providers: [GitHub],
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
