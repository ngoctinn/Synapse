import { getAuditLogs, AuditLogsPage } from "@/features/audit-logs";
import { Suspense } from "react";

export const metadata = {
  title: "Nhật ký hệ thống | Synapse",
  description: "Theo dõi các hoạt động của người dùng và hệ thống",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    action?: string;
    entityType?: string;
  }>;
}) {
  const { page, action, entityType } = await searchParams;
  const pageNum = Number(page) || 1;

  // Fetch data
  const { data, totalPages } = await getAuditLogs(pageNum, 10, {
    action: action as string,
    entityType: entityType as string,
  });

  return (
    <Suspense fallback={<div>Đang tải nhật ký...</div>}>
      <AuditLogsPage data={data} page={pageNum} totalPages={totalPages} />
    </Suspense>
  );
}
