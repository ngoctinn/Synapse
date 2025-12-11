import { getOperatingHours } from "@/features/settings/operating-hours";
import { OperatingHoursForm } from "@/features/settings/operating-hours/components/operating-hours-form";

export default async function OperatingHoursPage() {
  const operatingHours = await getOperatingHours();

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="flex-none p-4">
        <h1 className="text-2xl font-bold tracking-tight">Thời gian hoạt động</h1>
        <p className="text-muted-foreground mt-1">
          Cấu hình giờ làm việc và ngày nghỉ lễ của hệ thống.
        </p>
      </div>
      <div className="flex-1 p-4 pt-0 overflow-hidden">
        <div className="h-full surface-card overflow-hidden">
             <OperatingHoursForm initialConfig={operatingHours} />
        </div>
      </div>
    </div>
  );
}
