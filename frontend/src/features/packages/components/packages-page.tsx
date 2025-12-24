"use client";

import {
  PageContent,
  PageHeader,
  PageShell,
  SurfaceCard,
} from "@/shared/components/layout/page-layout";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { cn } from "@/shared/lib/utils";
import { FilterBar } from "@/shared/ui/custom/filter-bar";
import { Input } from "@/shared/ui/input";
import { Search } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { ServicePackage } from "../model/types";
import { CreatePackageTrigger, PackageTable } from "./index";

interface PackagesPageProps {
  data: ServicePackage[];
  page: number;
  totalPages: number;
}

export function PackagesPage({ data, page, totalPages }: PackagesPageProps) {
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
            Gói dịch vụ
          </h1>
          <p className="text-muted-foreground hidden text-sm md:block">
            Quản lý các gói combo dịch vụ
          </p>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <FilterBar
            startContent={
              <div className="relative w-full md:w-[250px]">
                <Search className="text-muted-foreground/70 absolute left-2.5 top-2.5 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Tìm gói dịch vụ..."
                  defaultValue={initialSearch}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="bg-background border-muted-foreground/20 focus-premium w-full pl-9"
                />
              </div>
            }
          />
          <div className="flex items-center gap-2">
            {[
              { label: "Tất cả", value: "all" },
              { label: "Đang hoạt động", value: "active" },
              { label: "Tạm ngưng", value: "inactive" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  if (opt.value === "all") params.delete("status");
                  else params.set("status", opt.value);
                  params.set("page", "1");
                  startTransition(() =>
                    router.replace(`${pathname}?${params.toString()}`)
                  );
                }}
                className={cn(
                  "rounded-full border px-3 py-1 text-sm transition-colors",
                  (searchParams.get("status") || "all") === opt.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:bg-accent"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="ml-auto">
            <CreatePackageTrigger />
          </div>
        </div>
      </PageHeader>

      <PageContent>
        <SurfaceCard className="border-muted/60">
          <PackageTable data={data} page={page} totalPages={totalPages} />
        </SurfaceCard>
      </PageContent>
    </PageShell>
  );
}
