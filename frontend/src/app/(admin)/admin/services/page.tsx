import { CreateServiceDialog, getServices, getSkills, ServiceTable, ServiceTableSkeleton } from "@/features/services";
import { CreateSkillDialog } from "@/features/services/components/create-skill-dialog";
import { SkillTable, SkillTableSkeleton } from "@/features/services/components/skill-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Suspense } from "react";

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
      availableSkills={skills}
      page={page}
      totalPages={totalPages}
    />
  );
}

// Server Component: Skill List
async function SkillList() {
  const skills = await getSkills();
  return <SkillTable skills={skills} />;
}

// Server Component: Create Service Button (needs skills)
async function CreateServiceWrapper() {
  const skills = await getSkills();
  return <CreateServiceDialog availableSkills={skills} />;
}

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const { page: pageParam, search } = await searchParams;
  const page = Number(pageParam) || 1;

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex-1 bg-white overflow-hidden flex flex-col">
        <Tabs defaultValue="list" className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-3 border-b shrink-0 bg-white">
            <TabsList className="h-9 bg-muted/50 p-1">
              <TabsTrigger value="list" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-medium px-4">
                Danh sách dịch vụ
              </TabsTrigger>
              <TabsTrigger value="skills" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-medium px-4">
                Danh sách kỹ năng
              </TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
                <TabsContent value="list" className="mt-0">
                    <Suspense fallback={<div className="h-9 w-32 bg-slate-100 rounded animate-pulse" />}>
                        <CreateServiceWrapper />
                    </Suspense>
                </TabsContent>
                <TabsContent value="skills" className="mt-0">
                    <CreateSkillDialog />
                </TabsContent>
            </div>
          </div>

          <div className="flex-1 overflow-hidden relative">
            <TabsContent value="list" className="h-full mt-0 border-0 p-0 data-[state=inactive]:hidden">
                 <Suspense fallback={<ServiceTableSkeleton />}>
                    <ServiceList page={page} search={search} />
                 </Suspense>
            </TabsContent>
            <TabsContent value="skills" className="h-full mt-0 border-0 p-0 data-[state=inactive]:hidden">
                <Suspense fallback={<SkillTableSkeleton />}>
                    <SkillList />
                </Suspense>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
