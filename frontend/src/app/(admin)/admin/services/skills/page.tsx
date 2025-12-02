import { CreateSkillDialog, getSkills, SkillTable, SkillTableSkeleton } from "@/features/services";
import { SearchInput } from "@/shared/ui/custom/search-input";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Quản lý kỹ năng | Synapse",
  description: "Quản lý danh sách kỹ năng",
};

async function SkillList({ page }: { page: number }) {
  const { data, total } = await getSkills(page, 5); // Use 5 to show pagination
  const totalPages = Math.ceil(total / 5);

  return (
    <SkillTable
      skills={data}
      page={page}
      totalPages={totalPages}
    />
  );
}

export default async function SkillsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0 bg-white">
        <div className="flex items-center gap-2 flex-1">
          <SearchInput placeholder="Tìm kiếm kỹ năng..." />
        </div>
        <CreateSkillDialog />
      </div>
      <div className="flex-1 overflow-hidden p-0">
        <Suspense fallback={<SkillTableSkeleton />}>
          <SkillList page={page} />
        </Suspense>
      </div>
    </div>
  );
}
