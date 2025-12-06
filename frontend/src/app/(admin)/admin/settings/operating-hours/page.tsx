import { getOperatingHours, OperatingHoursForm } from "@/features/settings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cấu hình Thời gian hoạt động | Synapse Admin",
  description: "Quản lý giờ mở cửa và ngày nghỉ lễ của Spa",
};

export default async function OperatingHoursPage() {
  const initialConfig = await getOperatingHours();

  return (
    <div className="container mx-auto py-6 max-w-5xl">
       <OperatingHoursForm initialConfig={initialConfig} />
    </div>
  );
}
