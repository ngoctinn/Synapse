import { getTreatments, TreatmentsPage } from "@/features/treatments";
import { Suspense } from "react";

export const metadata = {
  title: "Liệu trình khách hàng | Synapse",
  description: "Quản lý và theo dõi tiến độ liệu trình điều trị",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page) || 1;
  const status = resolvedParams.status as string;
  const search = resolvedParams.search as string;

  // Fetch data
  const result = await getTreatments(page, 10, status, search);
  const treatments = result.status === "success" ? result.data?.data ?? [] : [];
  const total = result.status === "success" ? result.data?.total ?? 0 : 0;
  const totalPages = Math.ceil(total / 10);

  return (
    <Suspense fallback={<div>Đang tải liệu trình...</div>}>
      <TreatmentsPage
        data={treatments}
        page={page}
        totalPages={totalPages}
      />
    </Suspense>
  );
}
