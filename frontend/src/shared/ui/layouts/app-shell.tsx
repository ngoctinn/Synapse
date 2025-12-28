import { cn } from "@/shared/lib/utils";
import * as React from "react";

interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  children: React.ReactNode;
  mobileNav?: React.ReactNode;
}

export function AppShell({
  children,
  sidebar,
  header,
  mobileNav,
  className,
  ...props
}: AppShellProps) {
  return (
    <div
      className={cn(
        "bg-muted/40 flex h-screen w-full overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Sidebar (Desktop) */}
      {sidebar && (
        <aside className="bg-background hidden w-[240px] flex-col border-r md:flex">
          {sidebar}
        </aside>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        {header && (
          <header className="bg-muted/40 flex h-14 items-center gap-4 border-b px-6 lg:h-16">
            {/* Mobile Nav Trigger logic is usually embedded in the MobileNav component itself or Header */}
            {mobileNav}
            <div className="flex flex-1 items-center gap-4">{header}</div>
          </header>
        )}

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
