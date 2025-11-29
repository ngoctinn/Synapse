import { AdminHeader, AdminSidebar } from "@/features/admin"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 p-3 gap-3 text-xs antialiased font-sans">
      {/* Sidebar */}
      <AdminSidebar className="hidden md:flex flex-shrink-0 z-20 rounded-2xl shadow-sm border-none" />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden gap-3">
        <AdminHeader className="rounded-2xl shadow-sm border-none" />
        <main className="flex-1 overflow-hidden scroll-smooth">
          <div className="w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
