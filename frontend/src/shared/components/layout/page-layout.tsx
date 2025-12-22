import { cn } from "@/shared/lib/utils"
import React from "react"

// --- Page Shell ---
type PageShellProps = React.HTMLAttributes<HTMLDivElement>

export function PageShell({ className, ...props }: PageShellProps) {
  return (
    <div
      className={cn("flex flex-col min-h-screen w-full bg-background", className)}
      {...props}
    />
  )
}

// --- Page Header ---
interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function PageHeader({ className, children, ...props }: PageHeaderProps) {
  return (
    <header
      className={cn(
        "header-sticky bg-card border-b",
        className
      )}
      {...props}
    >
      <div className="flex h-14 items-center px-4 gap-4 justify-between">
        {children}
      </div>
    </header>
  )
}

// --- Page Content ---
interface PageContentProps extends React.HTMLAttributes<HTMLDivElement> {
  fullWidth?: boolean
}

export function PageContent({ className, children, fullWidth = false, ...props }: PageContentProps) {
  return (
    <main
      className={cn(
        "flex-1 flex flex-col overflow-hidden",
        !fullWidth && "p-4 md:p-6 gap-4",
        className
      )}
      {...props}
    >
        {children}
    </main>
  )
}

// --- Surface Card ---
// Wrapper chuẩn cho content chính (Table, Form...)
type SurfaceCardProps = React.HTMLAttributes<HTMLDivElement>

export function SurfaceCard({ className, children, ...props }: SurfaceCardProps) {
  return (
    <div
      className={cn(
        "surface-card flex-1 flex flex-col overflow-hidden rounded-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
