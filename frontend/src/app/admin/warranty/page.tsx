import { getWarranties } from "@/features/warranty/actions";
import { CreateWarrantyTrigger, WarrantyTable } from "@/features/warranty/components";
import { PageHeader, PageContent, PageShell, SurfaceCard } from "@/shared/components/layout/page-layout";
import { Input } from "@/shared/ui/input";
import { FilterBar } from "@/shared/ui/custom/filter-bar";
import { Search } from "lucide-react";

export const metadata = {
  title: "Bảo hành | Synapse",
  description: "Quản lý phiếu bảo hành dịch vụ",
};

export default async function WarrantyPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page) || 1;
  const status = resolvedParams.status as string;

  // Fetch data
  const result = await getWarranties(page, 10, status);
  const warranties = result.status === "success" ? result.data?.data ?? [] : [];
  const total = result.status === "success" ? result.data?.total ?? 0 : 0;
  const totalPages = Math.ceil(total / 10);

  return (
    <PageShell>
      <PageHeader>
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold md:text-xl">Bảo hành</h1>
          <p className="text-sm text-muted-foreground hidden md:block">
            Quản lý phiếu bảo hành và cam kết chất lượng
          </p>
        </div>
        <div className="flex items-center gap-3">
          <FilterBar
            startContent={
              <div className="relative w-full md:w-[250px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Tìm mã phiếu hoặc khách hàng..."
                  className="w-full bg-background pl-9 h-9"
                />
              </div>
            }
          />
          <CreateWarrantyTrigger />
        </div>
      </PageHeader>

      <PageContent>
        <SurfaceCard className="p-0 overflow-hidden">
          <WarrantyTable
            data={warranties}
            page={page}
            totalPages={totalPages}
          />
        </SurfaceCard>
      </PageContent>
    </PageShell>
  );
}
