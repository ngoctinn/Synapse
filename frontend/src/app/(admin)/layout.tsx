import { AdminHeader, AdminSidebar } from "@/features/admin"
import { createClient } from "@/shared/lib/supabase/server"
import { SidebarInset, SidebarProvider } from "@/shared/ui/sidebar"
import { cookies } from "next/headers"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  let userProfile = null

  if (session?.access_token) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      if (apiUrl) {
        const response = await fetch(`${apiUrl}/users/me`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          },
          cache: 'no-store'
        })

        if (response.ok) {
          userProfile = await response.json()
        }
      }
    } catch {
      // Lỗi đã được xử lý silently - user sẽ thấy UI không authenticated
    }
  }

  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AdminSidebar />
      <SidebarInset className="max-h-svh overflow-hidden">
        <AdminHeader user={userProfile} />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 overflow-y-auto">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
