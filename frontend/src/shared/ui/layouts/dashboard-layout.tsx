import { AppShell } from "./app-shell";

interface DashboardLayoutWrapperProps {
  children: React.ReactNode;
  header: React.ReactNode;
  sidebar: React.ReactNode;
  footer: React.ReactNode;
  mobileNav: React.ReactNode;
}

export function DashboardLayoutWrapper({
  children,
  header,
  sidebar,
  footer,
  mobileNav,
}: DashboardLayoutWrapperProps) {
  return (
    <AppShell
      header={header}
      sidebar={sidebar}
      mobileNav={mobileNav}
    >
      <div className="flex flex-col min-h-full">
        <div className="flex-1">{children}</div>
        {footer && <div className="mt-8">{footer}</div>}
      </div>
    </AppShell>
  );
}
