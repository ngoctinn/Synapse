import { AuditTable } from "@/features/audit-logs/components";
import { getAuditLogs } from "@/features/audit-logs/actions";
import { PageShell, PageHeader, PageContent, SurfaceCard } from "@/shared/components/layout/page-layout";

export default async function AuditLogsPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams; // Await searchParams in Next.js 15+
  const pageNum = Number(page) || 1;
  const { data, totalPages } = await getAuditLogs(pageNum);

  return (
    <PageShell>
       <PageHeader>
          <div className="flex flex-col gap-1">
            <h1 className="text-lg font-semibold md:text-xl">Nhật ký hệ thống</h1>
            <p className="text-sm text-muted-foreground hidden md:block">
              Theo dõi các hoạt động của người dùng và hệ thống
            </p>
          </div>
       </PageHeader>

      <PageContent>
        <SurfaceCard className="p-0 overflow-hidden">
          <AuditTable
            data={data}
            page={pageNum}
            totalPages={totalPages}
          />
        </SurfaceCard>
      </PageContent>
    </PageShell>
  );
}
