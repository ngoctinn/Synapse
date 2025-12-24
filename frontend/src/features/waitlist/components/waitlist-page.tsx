"use client";

import { PageFooter } from "@/shared/components/layout/components/page-footer";
import {
  PageContent,
  PageHeader,
  PageShell,
  SurfaceCard,
} from "@/shared/components/layout/page-layout";
import { FilterBar } from "@/shared/ui/custom/filter-bar";
import { SearchInput } from "@/shared/ui/custom/search-input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import { WaitlistEntry } from "../model/types";
import { CreateWaitlistTrigger, WaitlistTable } from "./index";

interface WaitlistPageProps {
  data: WaitlistEntry[];
  page: number;
  totalPages: number;
}

export function WaitlistPage({ data, page, totalPages }: WaitlistPageProps) {
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
        title="Danh sách chờ"
        subtitle="Quản lý yêu cầu đặt lịch của khách hàng"
      >
        <div className="flex items-center gap-3">
          <FilterBar
            startContent={
              <SearchInput
                placeholder="Tìm khách hàng..."
                defaultValue={initialSearch}
                onChange={(e) => handleSearch(e.target.value)}
              />
            }
          />
          <CreateWaitlistTrigger />
        </div>
      </PageHeader>

      <PageContent>
        <SurfaceCard className="border-muted/60">
          <WaitlistTable
            data={data}
            page={page}
            totalPages={totalPages}
            hidePagination={true}
          />
        </SurfaceCard>
        <PageFooter
          page={page}
          totalPages={totalPages}
          onPageChange={(p) => {
            const params = new URLSearchParams(searchParams);
            params.set("page", p.toString());
            startTransition(() => {
              router.push(`${pathname}?${params.toString()}`);
            });
          }}
        />
      </PageContent>
    </PageShell>
  );
}
