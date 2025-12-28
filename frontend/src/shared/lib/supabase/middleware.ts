import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {

          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const path = url.pathname;

  // LƯU Ý: /reset-password KHÔNG thuộc nhóm này vì nó yêu cầu user phải có session.
  const isAuthRoute =
    path.startsWith("/login") ||
    path.startsWith("/register") ||
    path.startsWith("/forgot-password");

  const isCallbackRoute = path.startsWith("/auth"); // Callback oauth, confirm email...

  if (!user && !isAuthRoute && !isCallbackRoute) {
    url.pathname = "/login";
    url.searchParams.set("returnUrl", path); // Lưu lại URL để redirect sau khi login xong
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    url.pathname = "/"; // Redirect về trang chủ/dashboard
    return NextResponse.redirect(url);
  }

  if (user && path.startsWith("/admin")) {
    const userRole = user.user_metadata?.role || "customer";

    if (userRole === "customer") {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    const managerOnlyRoutes = ["/admin/staff", "/admin/settings"];
    const isManagerRoute = managerOnlyRoutes.some((route) =>
      path.startsWith(route)
    );

    if (isManagerRoute && userRole !== "manager") {
      url.pathname = "/admin"; // Redirect về dashboard admin chung
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
