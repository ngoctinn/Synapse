import { cn } from "@/shared/lib/utils";
import React from "react";

// --- Page Shell ---
type PageShellProps = React.HTMLAttributes<HTMLDivElement>;

export function PageShell({ className, ...props }: PageShellProps) {
  return (
    <div
      className={cn(
        "bg-background flex min-h-screen w-full flex-col",
        className
      )}
      {...props}
    />
  );
}

// --- Page Header ---
interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function PageHeader({ className, children, ...props }: PageHeaderProps) {
  return (
    <header
      className={cn("header-sticky bg-card border-b", className)}
      {...props}
    >
      <div className="flex h-14 items-center justify-between gap-4 px-4">
        {children}
      </div>
    </header>
  );
}

// --- Page Content ---
interface PageContentProps extends React.HTMLAttributes<HTMLDivElement> {
  fullWidth?: boolean;
}

export function PageContent({
  className,
  children,
  fullWidth = false,
  ...props
}: PageContentProps) {
  return (
    <main
      className={cn(
        "flex flex-1 flex-col overflow-hidden",
        !fullWidth && "gap-4 p-4 md:p-6",
        className
      )}
      {...props}
    >
      {children}
    </main>
  );
}

// --- Surface Card ---
// Wrapper chuẩn cho content chính (Table, Form...)
type SurfaceCardProps = React.HTMLAttributes<HTMLDivElement>;

export function SurfaceCard({
  className,
  children,
  ...props
}: SurfaceCardProps) {
  return (
    <div
      className={cn(
        "surface-card flex flex-1 flex-col overflow-hidden rounded-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
