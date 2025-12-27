"use client";

import {
  PageContent,
  PageHeader,
  PageShell,
  SurfaceCard,
} from "@/shared/components/layout/page-layout";
import { FilterBar } from "@/shared/ui/custom/filter-bar";
import { Input } from "@/shared/ui/input";
import { Group } from "@/shared/ui/layout";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import { WarrantyTicket } from "../model/types";
import { CreateWarrantyTrigger, WarrantyTable } from "./index";

interface WarrantyPageProps {
  data: WarrantyTicket[];
  page: number;
  totalPages: number;
}

export function WarrantyPage({ data, page, totalPages }: WarrantyPageProps) {
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
        title="Bảo hành"
        subtitle="Quản lý phiếu bảo hành và cam kết chất lượng"
      >
        <Group gap={3}>
          <FilterBar
            startContent={
          <div className="w-full md:w-[250px]">
            <Input
              type="search"
              placeholder="Tìm mã phiếu hoặc khách hàng..."
              defaultValue={initialSearch}
              onChange={(e) => handleSearch(e.target.value)}
              startContent={<Search size={16} className="text-muted-foreground" />}
              isSearch
            />
          </div>
            }
          />
          <CreateWarrantyTrigger />
        </Group>
      </PageHeader>

      <PageContent>
        <SurfaceCard className="border-muted/60">
          <WarrantyTable data={data} page={page} totalPages={totalPages} />
        </SurfaceCard>
      </PageContent>
    </PageShell>
  );
}
