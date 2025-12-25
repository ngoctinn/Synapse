import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/** Role hợp lệ trong hệ thống */
export type UserRole = "manager" | "receptionist" | "technician" | "customer";

/**
 * Lấy role của user hiện tại từ Supabase Auth.
 * Dùng trong Server Components và Server Actions.
 * @returns Role của user hoặc null nếu chưa đăng nhập
 */
export async function getCurrentUserRole(): Promise<UserRole | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return (user.user_metadata?.role as UserRole) || "customer";
}

/**
 * Kiểm tra user hiện tại có phải Manager không.
 * Dùng trong Server Actions để double-check quyền.
 */
export async function isCurrentUserManager(): Promise<boolean> {
  const role = await getCurrentUserRole();
  return role === "manager";
}

