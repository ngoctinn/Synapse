import { AdminHeader, AdminSidebar } from "@/features/admin";
import { BottomNav } from "@/features/admin/components/bottom-nav";
import { HeaderProvider } from "@/shared/lib/header-context";
import { createClient } from "@/shared/lib/supabase/server";
import { SidebarInset, SidebarProvider } from "@/shared/ui/sidebar";
import { cookies } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let userProfile = null;

  if (session?.access_token) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (apiUrl) {
        const response = await fetch(`${apiUrl}/users/me`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          cache: "no-store",
        });

        if (response.ok) {
          userProfile = await response.json();
        }
      }
    } catch {}
  }

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <HeaderProvider>
      <SidebarProvider defaultOpen={defaultOpen} className="bg-muted">
        <AdminSidebar />
        <SidebarInset className="bg-transparent h-screen max-h-svh overflow-hidden p-2">
          <AdminHeader
            user={userProfile}
            loading={!userProfile && session?.access_token ? true : false}
          />
          <div className="flex flex-1 flex-col overflow-y-auto mt-3 pb-6 scrollbar-none">
            {children}
          </div>
          <BottomNav />
        </SidebarInset>
      </SidebarProvider>
    </HeaderProvider>
  );
}
