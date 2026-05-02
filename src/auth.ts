import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

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
        console.log("credentials", credentials);
        const response = await fetch(`${process.env.NEXT_BACKEND_URL}/users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });

        const user = await response.json();
        console.log("user", user.data.Username);

        if (user?.status !== "failed") {
          return {
            id: user.data.ID,
            name: user.data.Fullname,
            email: JSON.stringify({
              username: user.data.Username,
              email: user.data.Email,
            }),
            image: user.data.PhotoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
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
        session.user.id = token.id;
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
    async authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isUnAuthorized = !isLoggedIn;

      return !isUnAuthorized;
    },
  },
});
