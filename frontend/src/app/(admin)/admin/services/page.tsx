import { CreateServiceDialog, getServices, getSkills, ServiceTable, ServiceTableSkeleton } from "@/features/services";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Quản lý dịch vụ | Synapse",
  description: "Quản lý danh sách dịch vụ",
};

// Server Component: Service List
async function ServiceList({ page, search }: { page: number; search?: string }) {
  // Fetch services and skills in parallel
  const [servicesData, skills] = await Promise.all([
    getServices(page, 10, search),
    getSkills()
  ]);

  const totalPages = Math.ceil(servicesData.total / 10);

  return (
    <ServiceTable
      services={servicesData.data}
      availableSkills={skills.data}
      page={page}
      totalPages={totalPages}
    />
  );
}

// Server Component: Create Service Button (needs skills)
async function CreateServiceWrapper() {
  const skills = await getSkills();
  return <CreateServiceDialog availableSkills={skills.data} />;
}

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const { page: pageParam, search } = await searchParams;
  const page = Number(pageParam) || 1;

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0 bg-white">
        <h1 className="text-lg font-semibold">Danh sách dịch vụ</h1>
        <Suspense fallback={<div className="h-9 w-32 bg-slate-100 rounded animate-pulse" />}>
            <CreateServiceWrapper />
        </Suspense>
      </div>
      <div className="flex-1 overflow-hidden p-0">
        <Suspense fallback={<ServiceTableSkeleton />}>
           <ServiceList page={page} search={search} />
        </Suspense>
      </div>
    </div>
  );
}
