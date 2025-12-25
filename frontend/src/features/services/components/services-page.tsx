"use client";

import { Resource, BedType } from "@/features/resources";
import {
  PageContent,
  PageHeader,
  PageShell,
  SurfaceCard,
} from "@/shared/components/layout/page-layout";
import { FilterBar } from "@/shared/ui/custom/filter-bar";
import { SearchInput } from "@/shared/ui/custom/search-input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { ActionResponse } from "@/shared/lib/action-response";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, use, useState, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import { PaginatedResponse, Service, Skill } from "../model/types";
import { CreateSkillDialog } from "./create-skill-dialog";
import { ServiceFilter } from "./service-filter";
import { ServiceTable, ServiceTableSkeleton } from "./service-table";
import { SkillTable, SkillTableSkeleton } from "./skill-table";

interface ServicesPageProps {
  page: number;
  skills: Skill[];
  bedTypes: BedType[];
  equipmentList: Resource[];
  servicesPromise: Promise<ActionResponse<PaginatedResponse<Service>>>;
}

function ServiceListWrapper({
  servicesPromise,
  skills,
  bedTypes,
  equipmentList,
  page,
}: {
  servicesPromise: Promise<ActionResponse<PaginatedResponse<Service>>>;
  skills: Skill[];
  bedTypes: BedType[];
  equipmentList: Resource[];
  page: number;
}) {
  const servicesRes = use(servicesPromise);

  const { data, total } =
    servicesRes.status === "success" && servicesRes.data
      ? servicesRes.data
      : { data: [], total: 0 };

  const totalPages = Math.ceil(total / 10);

  if (servicesRes.status === "error") {
    return (
      <div className="text-destructive p-4">
        Lỗi tải dịch vụ: {servicesRes.message}
      </div>
    );
  }

  return (
    <ServiceTable
      services={data}
      availableSkills={skills}
      page={page}
      totalPages={totalPages}
      variant="flush"
      className="border-none"
      hidePagination={false}
    />
  );
}


export function ServicesPage({
  page,
  skills,
  bedTypes,
  equipmentList,
  servicesPromise,
}: ServicesPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Get active tab from URL or default to 'list'
  const activeTab = searchParams.get("view") || "list";

  // Get initial search query from URL
  const initialSearch = searchParams.get("search")?.toString() || "";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("view", value);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  // Debounced search handler - syncs with URL params
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    // Reset page to 1 when searching
    params.set("page", "1");

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }, 300);

  const isServiceTab = activeTab === "list";

  return (
    <PageShell>
      <Tabs
        value={activeTab}
        className="flex w-full flex-1 flex-col gap-0"
        onValueChange={handleTabChange}
      >
        <PageHeader>
          <TabsList variant="default" size="default" aria-label="Quản lý dịch vụ">
            <TabsTrigger
              value="list"
              aria-label="Danh sách dịch vụ"
              variant="default"
              stretch={false}
            >
              Dịch vụ
            </TabsTrigger>
          </TabsList>

          <div className="flex w-full items-center gap-3 md:w-auto">
            <FilterBar
              startContent={
                <SearchInput
                  placeholder={
                    isServiceTab ? "Tìm kiếm dịch vụ..." : "Tìm kiếm kỹ năng..."
                  }
                  defaultValue={initialSearch}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              }
              endContent={
                isServiceTab && <ServiceFilter availableSkills={skills} />
              }
            />

            {isServiceTab ? null : null}
          </div>
        </PageHeader>

        <div className="page-entry-animation flex flex-1 flex-col overflow-hidden">
          <TabsContent
            value="list"
            className="mt-0 flex flex-1 flex-col border-0 p-0 data-[state=inactive]:hidden"
          >
            <PageContent>
              <SurfaceCard>
                <Suspense fallback={<ServiceTableSkeleton />}>
                  <ServiceListWrapper
                    servicesPromise={servicesPromise}
                    skills={skills}
                    bedTypes={bedTypes}
                    equipmentList={equipmentList}
                    page={page}
                  />
                </Suspense>
              </SurfaceCard>
            </PageContent>
          </TabsContent>
        </div>
      </Tabs>
    </PageShell>
  );
}
