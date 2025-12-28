  "use client";

  import { PackageTable } from "@/features/packages/components/package-table";
import { PaginatedPackages as PackagePaginationResponse } from "@/features/packages/model/types";
import { ResourceGroup } from "@/features/resources";
import {
    PageContent,
    PageHeader,
    PageShell,
    SurfaceCard,
} from "@/shared/components/layout/page-layout";
import { ActionResponse } from "@/shared/lib/action-response";
import { Stack } from "@/shared/ui/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, use, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import { ServiceCategory, ServicePagination, Skill } from "../model/types";
import { CategoryTable } from "./category-table";
import { ServiceTable, ServiceTableSkeleton } from "./service-table";
import { SkillTable } from "./skill-table";

  interface ServicesPageProps {
    page: number;
    skills: Skill[];
    categories: ServiceCategory[];
    resourceGroups: ResourceGroup[];
    servicesPromise: Promise<ActionResponse<ServicePagination>>;
    packagesPromise: Promise<ActionResponse<PackagePaginationResponse>>;
  }

  function ServiceListWrapper({
    servicesPromise,
    skills,
    categories,
    resourceGroups,
    page,
    searchProps,
    onDataLoaded,
  }: {
    servicesPromise: Promise<ActionResponse<ServicePagination>>;
    skills: Skill[];
    categories: ServiceCategory[];
    resourceGroups: ResourceGroup[];
    page: number;
    searchProps: {
      initialValue: string;
      onSearch: (term: string) => void;
    };
    onDataLoaded?: (data: any[]) => void;
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
        availableResourceGroups={resourceGroups}
        page={page}
        totalPages={totalPages}
        variant="flush"
        searchProps={searchProps}
      />
    );
  }

  function PackageListWrapper({
    packagesPromise,
    page,
    servicesPromise,
  }: {
    packagesPromise: Promise<ActionResponse<PackagePaginationResponse>>;
    page: number;
    servicesPromise: Promise<ActionResponse<ServicePagination>>;
  }) {
    const response = use(packagesPromise);
    const servicesResponse = use(servicesPromise);

    if (response.status === "error") {
      return (
        <div className="text-destructive p-4 text-center">
          Lỗi tải gói dịch vụ: {response.message}
        </div>
      );
    }

    const { data, total } = response.data!;
    const totalPages = Math.ceil(total / 10);
    const availableServices = servicesResponse.status === "success" ? servicesResponse.data!.data : [];

    return (
      <PackageTable
        data={data}
        page={page}
        totalPages={totalPages}
        availableServices={availableServices}
      />
    );
  }

  export function ServicesPage({
    page,
    skills,
    categories,
    resourceGroups,
    servicesPromise,
    packagesPromise,
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
      // Reset page to 1 when switching tabs
      params.set("page", "1");
      params.delete("search");
      params.delete("status");

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
          <PageHeader title="Danh mục sản phẩm">
            <TabsList size="sm" aria-label="Quản lý dịch vụ">
              <TabsTrigger
                value="list"
                aria-label="Danh sách dịch vụ"
                stretch={false}
              >
                Dịch vụ đơn
              </TabsTrigger>
              <TabsTrigger
                value="packages"
                aria-label="Gói combo dịch vụ"
                stretch={false}
              >
                Gói combo
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
                      resourceGroups={resourceGroups}
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

            <TabsContent value="packages" className="mt-0">
              <PageContent>
                <SurfaceCard>
                  <Suspense fallback={<ServiceTableSkeleton />}>
                    <PackageListWrapper
                      packagesPromise={packagesPromise}
                      servicesPromise={servicesPromise}
                      page={page}
                    />
                  </Suspense>
                </SurfaceCard>
              </PageContent>
            </TabsContent>

            <TabsContent value="skills" className="mt-0">
              <PageContent>
                <SurfaceCard>
                  <SkillTable skills={skills} variant="flush" />
                </SurfaceCard>
              </PageContent>
            </TabsContent>

            <TabsContent value="categories" className="mt-0">
              <PageContent>
                <SurfaceCard>
                  <CategoryTable categories={categories} variant="flush" />
                </SurfaceCard>
              </PageContent>
            </TabsContent>
          </Stack>
        </Tabs>
      </PageShell>
    );
  }
