import { CreateServiceDialog, getServices, getSkills, ServiceFilter, ServiceTable, ServiceTableSkeleton } from "@/features/services";
import { SearchInput } from "@/shared/ui/custom/search-input";

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
      className="-mx-4 border-x-0 rounded-none shadow-none"
    />
  );
}

// Server Component: Create Service Button (needs skills)
async function CreateServiceWrapper() {
  const skills = await getSkills();
  return <CreateServiceDialog availableSkills={skills.data} />;
}

async function ServiceFilterWrapper() {
    const skills = await getSkills();
    return <ServiceFilter availableSkills={skills.data} />;
}

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const { page: pageParam, search } = await searchParams;
  const page = Number(pageParam) || 1;

  return (
    <div className="min-h-screen flex flex-col pb-10">
      {/* Sticky Header with enhanced Glassmorphism */}
      <div className="sticky top-0 z-50 -mx-4 -mt-4 px-4 py-4 bg-background/80 backdrop-blur-md border-b flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300">
        <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Quản lý dịch vụ
            </h1>
            <p className="text-sm text-muted-foreground">
                Quản lý danh sách dịch vụ, giá cả và thời gian thực hiện.
            </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 flex-1 md:flex-none">
            <SearchInput placeholder="Tìm kiếm dịch vụ..." className="w-full md:w-[250px]" />
            <Suspense>
               <ServiceFilterWrapper />
            </Suspense>
          </div>
          <Suspense fallback={<div className="h-9 w-32 bg-slate-100 rounded animate-pulse" />}>
              <CreateServiceWrapper />
          </Suspense>
        </div>
      </div>

      <div className="flex-1 p-0 mt-2 animate-in fade-in-50 slide-in-from-bottom-4 duration-500 ease-out">
        <Suspense fallback={<ServiceTableSkeleton />}>
           <ServiceList page={page} search={search} />
        </Suspense>
      </div>
      {/* Short Footer */}
      <div className="text-center text-sm text-muted-foreground py-2">
        © 2025 Synapse. All rights reserved.
      </div>
    </div>
  );
}
