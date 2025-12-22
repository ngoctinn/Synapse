import { getCommissionReport } from "@/features/staff/actions";
import { CommissionReport } from "@/features/staff/components/commission-report";
import { PageContent, PageHeader, PageShell, SurfaceCard } from "@/shared/components/layout/page-layout";

export default async function CommissionReportPage() {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const result = await getCommissionReport(currentMonth, currentYear);
  const reportData = result.status === "success" ? result.data ?? [] : [];

  return (
    <PageShell>
      <PageHeader>
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold md:text-xl">Báo cáo hoa hồng</h1>
          <p className="text-sm text-muted-foreground hidden md:block">
            Thống kê doanh thu và hoa hồng của nhân viên
          </p>
        </div>
      </PageHeader>

      <PageContent>
        <SurfaceCard className="p-4 md:p-6">
            <CommissionReport data={reportData} />
        </SurfaceCard>
      </PageContent>
    </PageShell>
  );
}
