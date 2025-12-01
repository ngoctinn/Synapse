import { CreateSkillDialog, getSkills, SkillTable, SkillTableSkeleton } from "@/features/services";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Quản lý kỹ năng | Synapse",
  description: "Quản lý danh sách kỹ năng",
};

async function SkillList() {
  const skills = await getSkills();
  return <SkillTable skills={skills} />;
}

export default function SkillsPage() {
  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0 bg-white">
        <h1 className="text-lg font-semibold">Danh sách kỹ năng</h1>
        <CreateSkillDialog />
      </div>
      <div className="flex-1 overflow-hidden p-0">
        <Suspense fallback={<SkillTableSkeleton />}>
          <SkillList />
        </Suspense>
      </div>
    </div>
  );
}
