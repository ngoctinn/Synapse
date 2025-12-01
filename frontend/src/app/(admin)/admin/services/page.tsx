import { CreateServiceDialog, getServices, getSkills, ServiceTable } from "@/features/services";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const { page: pageParam, search } = await searchParams;
  const page = Number(pageParam) || 1;
  const limit = 10;

  const [servicesData, skills] = await Promise.all([
    getServices(page, limit, search),
    getSkills()
  ]);

  const totalPages = Math.ceil(servicesData.total / limit);

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex-1 bg-white overflow-hidden flex flex-col">
        <Tabs defaultValue="list" className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-3 border-b shrink-0 bg-white">
            <TabsList className="h-9 bg-muted/50 p-1">
              <TabsTrigger value="list" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-medium px-4">
                Danh sách dịch vụ
              </TabsTrigger>
            </TabsList>
            <CreateServiceDialog availableSkills={skills} />
          </div>

          <div className="flex-1 overflow-hidden relative">
            <TabsContent value="list" className="h-full mt-0 border-0 p-0 data-[state=inactive]:hidden">
                 <ServiceTable
                   services={servicesData.data}
                   availableSkills={skills}
                   page={page}
                   totalPages={totalPages}
                 />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
