"use client";

import {
  PageContent,
  PageHeader,
  PageShell,
  SurfaceCard,
} from "@/shared/components/layout/page-layout";
import { FilterBar } from "@/shared/ui/custom/filter-bar";
import { Input } from "@/shared/ui/input";
import { HStack } from "@/shared/ui/layout/stack";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import { CustomerTreatment } from "../model/types";
import { TreatmentTable } from "./treatment-table";

interface TreatmentsPageProps {
  data: CustomerTreatment[];
  page: number;
  totalPages: number;
}

export function TreatmentsPage({
  data,
  page,
  totalPages,
}: TreatmentsPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const initialSearch = searchParams.get("search")?.toString() || "";

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    params.set("page", "1");

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }, 300);

  return (
    <PageShell>
      <PageHeader
        title="Liệu trình"
        subtitle="Theo dõi tiến độ điều trị của khách hàng"
      >
        <HStack gap={3}>
          <FilterBar
            startContent={
          <div className="w-full md:w-64">
            <Input
              type="search"
              placeholder="Tìm theo tên khách hoặc mã..."
              defaultValue={initialSearch}
              onChange={(e) => handleSearch(e.target.value)}
              startContent={<Search size={16} className="text-muted-foreground" />}
              isSearch
            />
          </div>
            }
          />
        </HStack>
      </PageHeader>

      <PageContent>
        <SurfaceCard className="border-muted/60">
          <TreatmentTable data={data} page={page} totalPages={totalPages} />
        </SurfaceCard>
      </PageContent>
    </PageShell>
  );
}
