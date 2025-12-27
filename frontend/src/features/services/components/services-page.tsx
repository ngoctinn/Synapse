"use client";

import { BedType, Resource } from "@/features/resources";
import {
    PageContent,
    PageHeader,
    PageShell,
    SurfaceCard,
} from "@/shared/components/layout/page-layout";
import { ActionResponse } from "@/shared/lib/action-response";
import { Icon } from "@/shared/ui/custom";
import { FilterBar } from "@/shared/ui/custom/filter-bar";
import { Input } from "@/shared/ui/input";
import { Group, Stack } from "@/shared/ui/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, use, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import { PaginatedResponse, Service, ServiceCategory, Skill } from "../model/types";
import { ServiceFilter } from "./service-filter";
import { ServiceTable, ServiceTableSkeleton } from "./service-table";

interface ServicesPageProps {
  page: number;
  skills: Skill[];
  categories: ServiceCategory[];
  bedTypes: BedType[];
  equipmentList: Resource[];
  servicesPromise: Promise<ActionResponse<PaginatedResponse<Service>>>;
}

function ServiceListWrapper({
  servicesPromise,
  skills,
  categories,
  bedTypes,
  equipmentList,
  page,
}: {
  servicesPromise: Promise<ActionResponse<PaginatedResponse<Service>>>;
  skills: Skill[];
  categories: ServiceCategory[];
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
      availableCategories={categories}
      page={page}
      totalPages={totalPages}
      variant="flush"
      hidePagination={false}
    />
  );
}


export function ServicesPage({
  page,
  skills,
  categories,
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
      <Stack gap={0} asChild>
        <Tabs
          id="services-tabs"
          value={activeTab}
          onValueChange={handleTabChange}
        >
        <PageHeader>
          <TabsList size="default" aria-label="Quản lý dịch vụ">
            <TabsTrigger
              value="list"
              aria-label="Danh sách dịch vụ"
              stretch={false}
            >
              Dịch vụ
            </TabsTrigger>
          </TabsList>

          <Group gap={3} className="w-full md:w-auto">
            <FilterBar
              startContent={
                <Input
                  placeholder={
                    isServiceTab ? "Tìm kiếm dịch vụ..." : "Tìm kiếm kỹ năng..."
                  }
                  defaultValue={initialSearch}
                  onChange={(e) => handleSearch(e.target.value)}
                  startContent={<Icon icon={Search} className="text-muted-foreground" size={16} />}
                  className="w-full md:w-64"
                />
              }
              endContent={
                isServiceTab && <ServiceFilter availableSkills={skills} availableCategories={categories} />
              }
            />
          </Group>
        </PageHeader>

        <Stack gap={0} className="overflow-hidden">
          <TabsContent
            value="list"
            className="mt-0"
          >
            <PageContent>
              <SurfaceCard>
                <Suspense fallback={<ServiceTableSkeleton />}>
                  <ServiceListWrapper
                    servicesPromise={servicesPromise}
                    skills={skills}
                    categories={categories}
                    bedTypes={bedTypes}
                    equipmentList={equipmentList}
                    page={page}
                  />
                </Suspense>
              </SurfaceCard>
            </PageContent>
          </TabsContent>
        </Stack>
      </Tabs>
    </Stack>
  </PageShell>
  );
}
