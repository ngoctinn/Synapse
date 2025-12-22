import { getWarranties, WarrantyPage } from "@/features/warranty";
import { Suspense } from "react";

export const metadata = {
  title: "Bảo hành | Synapse",
  description: "Quản lý phiếu bảo hành dịch vụ",
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
  const result = await getWarranties(page, 10, status, search);
  const warranties = result.status === "success" ? result.data?.data ?? [] : [];
  const total = result.status === "success" ? result.data?.total ?? 0 : 0;
  const totalPages = Math.ceil(total / 10);

  return (
    <Suspense fallback={<div>Đang tải bảo hành...</div>}>
      <WarrantyPage
        data={warranties}
        page={page}
        totalPages={totalPages}
      />
    </Suspense>
  );
}
