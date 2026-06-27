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
        const user = await axiosClient.post("/auth/users/login", {
          email_address,
          password,
        });

        if (user?.data?.status !== "failed") {
          return {
            id: user?.data?.data?.id,
            name: user?.data?.data?.fullname,
            email: JSON.stringify({
              username: user?.data?.data?.username,
              email: user?.data?.data?.email_address,
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
