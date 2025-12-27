import { DashboardNav, MobileNav } from "@/features/customer-dashboard";
import { Footer, Header } from "@/shared/components/layout";
import { DashboardLayoutWrapper } from "@/shared/ui/layouts/dashboard-layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayoutWrapper
      header={<Header />}
      sidebar={<DashboardNav />}
      footer={<Footer />}
      mobileNav={<MobileNav />}
    >
      {children}
    </DashboardLayoutWrapper>
  );
}
