import { getWaitlist, WaitlistPage } from "@/features/waitlist";
import { Suspense } from "react";

export const metadata = {
  title: "Danh sách chờ | Synapse",
  description: "Quản lý danh sách khách hàng chờ đặt lịch",
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
  const result = await getWaitlist(page, 10, status, search);
  const waitlist = result.status === "success" ? result.data?.data ?? [] : [];
  const total = result.status === "success" ? result.data?.total ?? 0 : 0;
  const totalPages = Math.ceil(total / 10);

  return (
    <Suspense fallback={<div>Đang tải danh sách chờ...</div>}>
      <WaitlistPage
        data={waitlist}
        page={page}
        totalPages={totalPages}
      />
    </Suspense>
  );
}
