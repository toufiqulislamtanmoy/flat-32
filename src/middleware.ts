import { auth } from "@/auth";

export default auth((req) => {
  const isAuth = !!req.auth;
  const isAuthPage =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/forget-password") ||
    req.nextUrl.pathname.startsWith("/reset-password");
  const isApiAuth = req.nextUrl.pathname.startsWith("/api/auth");

  if (isApiAuth) {
    return;
  }

  if (isAuthPage) {
    if (isAuth) {
      return Response.redirect(new URL("/", req.nextUrl));
    }
    return;
  }

  if (!isAuth) {
    let from = req.nextUrl.pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }

    return Response.redirect(new URL(`/login?from=${encodeURIComponent(from)}`, req.nextUrl));
  }
});
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
