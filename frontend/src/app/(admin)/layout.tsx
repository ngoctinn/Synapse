import { AdminHeader, AdminSidebar } from "@/features/admin"
import { ScrollArea } from "@/shared/ui/scroll-area"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 p-3 gap-3 text-xs antialiased font-sans">
      {/* Thanh bên */}
      <AdminSidebar className="hidden md:flex flex-shrink-0 z-20 rounded-2xl shadow-sm border-none" />

      {/* Nội dung chính */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden gap-3">
        <AdminHeader className="rounded-2xl shadow-sm border-none" />
        
        {/* Khu vực cuộn nội dung */}
        <ScrollArea className="flex-1 rounded-2xl border-none shadow-sm bg-transparent">
            <main className="w-full min-h-full">
              {children}
            </main>
        </ScrollArea>
      </div>
    </div>
  )
}
