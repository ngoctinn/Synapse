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
        "flex w-full flex-col gap-4", // Removed min-h-screen, bg-muted/40 (handled by AppShell)
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
      className={cn("z-20 flex flex-col gap-4", className)}
      {...props}
    >
      <div className="flex min-h-[3rem] items-center justify-between gap-4 px-0 py-2">
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

// --- Sticky Header ---
interface StickyHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function StickyHeader({
  className,
  children,
  ...props
}: StickyHeaderProps) {
  return (
    <div
      className={cn(
        "bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
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
    <div // Changed from main to div
      className={cn(
        "flex flex-1 flex-col", // Removed overflow-hidden to let AppShell scroll
        !fullWidth && "gap-4", // Removed fixed px/py as AppShell handles padding
        className
      )}
      {...props}
    >
      {children}
    </div>
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
        "surface-card relative flex flex-1 flex-col overflow-hidden rounded-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
