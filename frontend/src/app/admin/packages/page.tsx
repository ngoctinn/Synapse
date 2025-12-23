import { getPackages, PackagesPage } from "@/features/packages";
import { Suspense } from "react";

export const metadata = {
  title: "Gói dịch vụ | Synapse",
  description: "Quản lý các gói dịch vụ combo",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page) || 1;
  const search = resolvedParams.search as string;
  const status = resolvedParams.status as string;

  // Fetch data
  const result = await getPackages(page, 10, search, status);
  const packages = result.status === "success" ? (result.data?.data ?? []) : [];
  const total = result.status === "success" ? (result.data?.total ?? 0) : 0;
  const totalPages = Math.ceil(total / 10);

  return (
    <Suspense fallback={<div>Đang tải gói dịch vụ...</div>}>
      <PackagesPage data={packages} page={page} totalPages={totalPages} />
    </Suspense>
  );
}
