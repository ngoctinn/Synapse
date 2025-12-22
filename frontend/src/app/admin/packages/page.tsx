import { getPackages } from "@/features/packages/actions";
import { PackageTable, CreatePackageTrigger } from "@/features/packages/components";
import { PageHeader, PageContent, PageShell, SurfaceCard } from "@/shared/components/layout/page-layout";
import { Input } from "@/shared/ui/input";
import { FilterBar } from "@/shared/ui/custom/filter-bar";
import { Plus, Search } from "lucide-react";

export const metadata = {
  title: "Gói dịch vụ | Synapse",
  description: "Quản lý các gói dịch vụ combo",
};

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page) || 1;
  const search = resolvedParams.search as string;

  // Mock fetch call - in real app would pass search param
  const result = await getPackages(page, 10);
  const packages = result.status === "success" ? result.data?.data ?? [] : [];
  const total = result.status === "success" ? result.data?.total ?? 0 : 0;
  const totalPages = Math.ceil(total / 10);

  return (
    <PageShell>
      <PageHeader>
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold md:text-xl">Gói dịch vụ</h1>
          <p className="text-sm text-muted-foreground hidden md:block">
            Quản lý các gói combo dịch vụ
          </p>
        </div>
        <div className="flex items-center gap-3">
          <FilterBar
            startContent={
              <div className="relative w-full md:w-[250px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Tìm gói dịch vụ..."
                  className="w-full bg-background pl-9 h-9"
                  defaultValue={search}
                />
              </div>
            }
          />
          <CreatePackageTrigger />
        </div>
      </PageHeader>

      <PageContent>
        <SurfaceCard className="p-0 overflow-hidden">
          <PackageTable
            data={packages}
            page={page}
            totalPages={totalPages}
          />
        </SurfaceCard>
      </PageContent>
    </PageShell>
  );
}
