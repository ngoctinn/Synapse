"use client";

import {
  PageContent,
  PageHeader,
  PageShell,
  SurfaceCard,
} from "@/shared/components/layout/page-layout";
import { ActionResponse } from "@/shared/lib/action-response";
import { Stack } from "@/shared/ui/layout/stack";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, use, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import { ServiceCategory, ServicePagination, Skill } from "../model/types";
import { ServiceTable, ServiceTableSkeleton } from "./service-table";

interface ServicesPageProps {
  page: number;
  skills: Skill[];
  categories: ServiceCategory[];
  servicesPromise: Promise<ActionResponse<ServicePagination>>;
}

function ServiceListWrapper({
  servicesPromise,
  skills,
  categories,
  page,
  searchProps,
}: {
  servicesPromise: Promise<ActionResponse<ServicePagination>>;
  skills: Skill[];
  categories: ServiceCategory[];
  page: number;
  searchProps: {
    initialValue: string;
    onSearch: (term: string) => void;
  };
}) {
  const response = use(servicesPromise);

  if (response.status === "error") {
    return (
      <div className="text-destructive p-4 text-center">
        Lỗi tải dữ liệu: {response.message}
      </div>
    );
  }

  const { data, total } = response.data!;
  const totalPages = Math.ceil(total / 10);

  return (
    <ServiceTable
      services={data}
      availableSkills={skills}
      availableCategories={categories}
      page={page}
      totalPages={totalPages}
      variant="flush"
      searchProps={searchProps}
    />
  );
}

export function ServicesPage({
  page,
  skills,
  categories,
  servicesPromise,
}: ServicesPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [, startTransition] = useTransition();

  // Get active tab from URL or default to 'list'
  const activeTab = searchParams.get("view") || "list";

  // Get initial search query
  const initialSearch = searchParams.get("search")?.toString() || "";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("view", value);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

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

  return (
    <PageShell>
      <Tabs
        id="services-tabs"
        value={activeTab}
        onValueChange={handleTabChange}
        className="flex flex-col gap-0"
      >
        <PageHeader
           title="Dịch vụ"
           subtitle="Quản lý danh mục dịch vụ, kỹ năng và tài liệu chuyên môn của spa."
        >
          <TabsList size="sm" aria-label="Quản lý dịch vụ">
            <TabsTrigger
              value="list"
              aria-label="Danh sách dịch vụ"
              stretch={false}
            >
              Danh sách
            </TabsTrigger>
            <TabsTrigger
              value="skills"
              aria-label="Kỹ năng kỹ thuật viên"
              stretch={false}
            >
              Kỹ năng
            </TabsTrigger>
             <TabsTrigger
              value="categories"
              aria-label="Danh mục dịch vụ"
              stretch={false}
            >
              Danh mục
            </TabsTrigger>
          </TabsList>
        </PageHeader>

        <Stack gap={0} className="page-entry-animation overflow-hidden">
          <TabsContent value="list" className="mt-0">
            <PageContent>
              <SurfaceCard>
                <Suspense fallback={<ServiceTableSkeleton />}>
                  <ServiceListWrapper
                    servicesPromise={servicesPromise}
                    skills={skills}
                    categories={categories}
                    page={page}
                    searchProps={{
                      initialValue: initialSearch,
                      onSearch: handleSearch,
                    }}
                  />
                </Suspense>
              </SurfaceCard>
            </PageContent>
          </TabsContent>

          <TabsContent value="skills" className="mt-0">
            <PageContent>
              <SurfaceCard className="text-muted-foreground flex items-center justify-center p-8">
                Tính năng quản lý kỹ năng đang được phát triển.
              </SurfaceCard>
            </PageContent>
          </TabsContent>

          <TabsContent value="categories" className="mt-0">
            <PageContent>
              <SurfaceCard className="text-muted-foreground flex items-center justify-center p-8">
                Tính năng quản lý danh mục đang được phát triển.
              </SurfaceCard>
            </PageContent>
          </TabsContent>
        </Stack>
      </Tabs>
  </PageShell>
  );
}
