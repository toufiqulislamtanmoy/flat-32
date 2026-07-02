import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axiosClient from "./helper/axiosClient";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      authorize: async (credentials) => {
        const { email: email_address, password } = credentials as {
          email: string;
          password: string;
        };
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email_address, password }),
        });
        const user = await response.json();

        if (user?.status !== "failed") {
          return {
            id: user?.data?.user_id,
            name: user?.data?.fullname,
            email: JSON.stringify({
              username: user?.data?.username,
              email: user?.data?.email_address,
            }),
            image: user?.data?.photo_url || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          };
        } else {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async redirect({ url }) {
      if (url?.length > 600) {
        return new URL(url).origin;
      }
      return url;
    },
  },
});
