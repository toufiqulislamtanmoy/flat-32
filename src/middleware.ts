import { auth } from "@/auth";

export default auth((req) => {
  const isAuth = !!req.auth;
  const isAuthPage =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/forget-password") ||
    req.nextUrl.pathname.startsWith("/reset-password") ||
    req.nextUrl.pathname.startsWith("/register");

  const isApiAuth = req.nextUrl.pathname.startsWith("/api/auth");

  if (isApiAuth) {
    return;
  }

  if (isAuthPage) {
    if (isAuth) {
      const from = req.nextUrl.searchParams.get("from");
      const target = from && from.startsWith("/") && !from.startsWith("//") ? from : "/";
      return Response.redirect(new URL(target, req.nextUrl));
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
  // Skip API, Next internals, metadata icons and any static file (e.g. .png, .svg, .ico)
  matcher: [
    "/((?!api|_next/static|_next/image|icon|apple-icon|favicon|.*\\.(?:png|jpe?g|gif|svg|ico|webp|avif)$).*)",
  ],
};
