import { ReactNode } from "react"

interface AppointmentLayoutProps {
  children: ReactNode
  sidebar: ReactNode
}

export function AppointmentLayout({ children, sidebar }: AppointmentLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      {sidebar}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden h-full relative">
        {children}
      </main>
    </div>
  )
}
