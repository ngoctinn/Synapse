import { cn } from "@/shared/lib/utils";
import React from "react";

// --- Page Shell ---
interface PageShellProps extends React.HTMLAttributes<HTMLDivElement> {
  animate?: boolean;
}

export function PageShell({
  className,
  animate = true,
  children,
  ...props
}: PageShellProps) {
  return (
    <div
      className={cn(
        "bg-background flex min-h-screen w-full flex-col",
        animate && "page-entry-animation",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// --- Page Header ---
interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  backHref?: string;
}

export function PageHeader({
  className,
  children,
  title,
  subtitle,
  backHref,
  ...props
}: PageHeaderProps) {
  return (
    <header
      className={cn("header-sticky bg-card border-b z-20", className)}
      {...props}
    >
      <div className="flex h-14 items-center justify-between gap-4 px-0">
        {(title || subtitle) && (
          <div className="flex flex-col gap-0.5">
            {title && (
              <h1 className="text-lg font-semibold tracking-tight md:text-xl">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-muted-foreground hidden text-sm md:block">
                {subtitle}
              </p>
            )}
          </div>
        )}
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
        !fullWidth && "gap-4 px-0 py-4 md:py-6",
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
