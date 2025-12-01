import { AdminHeader, AdminSidebar } from "@/features/admin"
import { createClient } from "@/shared/lib/supabase/server"
import { SidebarInset, SidebarProvider } from "@/shared/ui/sidebar"

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
    } catch (error) {
      console.error("Failed to fetch user profile in AdminLayout:", error)
    }
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminHeader user={userProfile} />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
