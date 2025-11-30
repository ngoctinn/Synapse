import { CreateServiceDialog, getServices, getSkills, ServiceTable } from "@/features/services";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

export default async function ServicesPage() {
  const [services, skills] = await Promise.all([
    getServices(),
    getSkills()
  ]);

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
                   services={services} 
                   availableSkills={skills} 
                   page={1}
                   totalPages={10}
                 />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
