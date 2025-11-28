import { AdminHeader } from "@/features/admin/components/header"
import { AdminSidebar } from "@/features/admin/components/sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-xs antialiased font-sans">
      {/* Sidebar */}
      <AdminSidebar className="hidden w-40 md:flex flex-shrink-0 z-20" />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-slate-50/50">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
