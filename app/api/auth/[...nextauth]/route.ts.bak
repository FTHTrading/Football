import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// In production, swap this for Prisma user lookups
// import { prisma } from "@/lib/prisma";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Under Center",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "qb1@undercenter.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // ────────────────────────────────────────────
        //  PLACEHOLDER: Replace with Prisma lookup
        // ────────────────────────────────────────────
        const demoUsers = [
          {
            id: "admin-1",
            email: "admin@undercenter.com",
            name: "UC Admin",
            role: "ADMIN",
            passwordHash: await bcrypt.hash("admin123", 10),
          },
          {
            id: "athlete-1",
            email: "jaxon@undercenter.com",
            name: "Jaxon Smith",
            role: "ATHLETE",
            passwordHash: await bcrypt.hash("demo123", 10),
          },
        ];

        const user = demoUsers.find((u) => u.email === credentials.email);
        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
