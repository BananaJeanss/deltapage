import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

type UserRole = "admin";
interface AdminUser {
  id: string;
  name: string;
  role: UserRole;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<AdminUser | null> {
        if (!credentials) return null;
        const { username, password } = credentials as {
          username: string;
          password: string;
        };

        if (
          username === process.env.ADMIN_USER &&
          password === process.env.ADMIN_PASS
        ) {
          return {
            id: "admin",
            name: "Admin",
            role: "admin",
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user && (user as AdminUser).role) {
        token.role = (user as AdminUser).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.role) {
        // ensure user object exists
        session.user = session.user ?? {};
        (session.user as AdminUser).role = token.role as UserRole;
      }
      return session;
    },
  },
});