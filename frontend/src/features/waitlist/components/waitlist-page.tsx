"use client";

import { PageFooter } from "@/shared/components/layout/components/page-footer";
import {
  PageContent,
  PageHeader,
  PageShell,
  SurfaceCard,
} from "@/shared/components/layout/page-layout";
import { FilterBar } from "@/shared/ui/custom/filter-bar";
import { Input } from "@/shared/ui/input";
import { Search } from "lucide-react";
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
      <PageHeader>
        <div className="flex flex-col gap-0.5">
          <h1 className="text-lg font-medium tracking-tight md:text-xl">
            Danh sách chờ
          </h1>
          <p className="text-muted-foreground hidden text-sm md:block">
            Quản lý yêu cầu đặt lịch của khách hàng
          </p>
        </div>
        <div className="flex items-center gap-3">
          <FilterBar
            startContent={
              <div className="relative w-full md:w-[250px]">
                <Search className="text-muted-foreground/70 absolute left-2.5 top-2.5 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Tìm khách hàng..."
                  defaultValue={initialSearch}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="bg-background border-muted-foreground/20 focus-premium h-9 w-full pl-9"
                />
              </div>
            }
          />
          <CreateWaitlistTrigger />
        </div>
      </PageHeader>

      <PageContent>
        <SurfaceCard className="border-muted/60">
          <WaitlistTable data={data} page={page} totalPages={totalPages} />
        </SurfaceCard>
        <PageFooter />
      </PageContent>
    </PageShell>
  );
}
