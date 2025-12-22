import { DashboardNav, MobileNav } from "@/features/customer-dashboard"
import { Footer, Header } from "@/shared/components/layout"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/50">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 py-6 md:p-6">
        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
           <aside className="hidden md:block">
             <DashboardNav />
           </aside>

           <div className="min-w-0">
             {children}
           </div>
        </div>
      </main>
      <div className="hidden md:block">
        <Footer />
      </div>
      <MobileNav />
    </div>
  )
}
