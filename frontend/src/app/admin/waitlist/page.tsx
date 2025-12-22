import { getWaitlist } from "@/features/waitlist/actions";
import { CreateWaitlistTrigger, WaitlistTable } from "@/features/waitlist/components";
import { PageHeader, PageContent, PageShell, SurfaceCard } from "@/shared/components/layout/page-layout";
import { Input } from "@/shared/ui/input";
import { FilterBar } from "@/shared/ui/custom/filter-bar";
import { Search } from "lucide-react";

export const metadata = {
  title: "Danh sách chờ | Synapse",
  description: "Quản lý danh sách khách hàng chờ đặt lịch",
};

export default async function WaitlistPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page) || 1;
  const status = resolvedParams.status as string;

  // Fetch data
  const result = await getWaitlist(page, 10, status);
  const waitlist = result.status === "success" ? result.data?.data ?? [] : [];
  const total = result.status === "success" ? result.data?.total ?? 0 : 0;
  const totalPages = Math.ceil(total / 10);

  return (
    <PageShell>
      <PageHeader>
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold md:text-xl">Danh sách chờ</h1>
          <p className="text-sm text-muted-foreground hidden md:block">
            Quản lý yêu cầu đặt lịch của khách hàng
          </p>
        </div>
        <div className="flex items-center gap-3">
          <FilterBar
            startContent={
              <div className="relative w-full md:w-[250px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Tìm khách hàng..."
                  className="w-full bg-background pl-9 h-9"
                />
              </div>
            }
          />
          <CreateWaitlistTrigger />
        </div>
      </PageHeader>

      <PageContent>
        <SurfaceCard className="p-0 overflow-hidden">
          <WaitlistTable
            data={waitlist}
            page={page}
            totalPages={totalPages}
          />
        </SurfaceCard>
      </PageContent>
    </PageShell>
  );
}
