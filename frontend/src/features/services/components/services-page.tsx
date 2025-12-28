  "use client";

  import { PackageTable, PackageTableSkeleton } from "@/features/packages/components/package-table";
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
import { CategoryTable, CategoryTableSkeleton } from "./category-table";
import { ServiceTable, ServiceTableSkeleton } from "./service-table";
import { SkillTable, SkillTableSkeleton } from "./skill-table";

  interface ServicesPageProps {
    page: number;
    skillsPromise: Promise<ActionResponse<Skill[]>>;
    categoriesPromise: Promise<ActionResponse<ServiceCategory[]>>;
    resourceGroupsPromise: Promise<ActionResponse<ResourceGroup[]>>;
    servicesPromise: Promise<ActionResponse<ServicePagination>>;
    packagesPromise: Promise<ActionResponse<PackagePaginationResponse>>;
  }

  function ServiceListWrapper({
    servicesPromise,
    skillsPromise,
    categoriesPromise,
    resourceGroupsPromise,
    page,
    searchProps,
  }: {
    servicesPromise: Promise<ActionResponse<ServicePagination>>;
    skillsPromise: Promise<ActionResponse<Skill[]>>;
    categoriesPromise: Promise<ActionResponse<ServiceCategory[]>>;
    resourceGroupsPromise: Promise<ActionResponse<ResourceGroup[]>>;
    page: number;
    searchProps: {
      initialValue: string;
      onSearch: (term: string) => void;
    };
  }) {
    const response = use(servicesPromise);
    const skillsRes = use(skillsPromise);
    const categoriesRes = use(categoriesPromise);
    const resourceGroupsRes = use(resourceGroupsPromise);

    if (response.status === "error") {
      return (
        <div className="text-destructive p-4 text-center">
          Lỗi tải dữ liệu: {response.message}
        </div>
      );
    }

    const skills = skillsRes.status === "success" ? skillsRes.data || [] : [];
    const categories = categoriesRes.status === "success" ? categoriesRes.data || [] : [];
    const resourceGroups = resourceGroupsRes.status === "success" ? resourceGroupsRes.data || [] : [];

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

  function CategoryListWrapper({
    categoriesPromise,
  }: {
    categoriesPromise: Promise<ActionResponse<ServiceCategory[]>>;
  }) {
    const response = use(categoriesPromise);

    if (response.status === "error") {
      return (
        <div className="text-destructive p-4 text-center">
          Lỗi tải danh mục: {response.message}
        </div>
      );
    }

    const categories = response.data || [];

    return <CategoryTable categories={categories} variant="flush" />;
  }

  function SkillListWrapper({
    skillsPromise,
  }: {
    skillsPromise: Promise<ActionResponse<Skill[]>>;
  }) {
    const response = use(skillsPromise);

    if (response.status === "error") {
      return (
        <div className="text-destructive p-4 text-center">
          Lỗi tải kỹ năng: {response.message}
        </div>
      );
    }

    const skills = response.data || [];

    return <SkillTable skills={skills} variant="flush" />;
  }

  export function ServicesPage({
    page,
    skillsPromise,
    categoriesPromise,
    resourceGroupsPromise,
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
                      skillsPromise={skillsPromise}
                      categoriesPromise={categoriesPromise}
                      resourceGroupsPromise={resourceGroupsPromise}
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
                  <Suspense fallback={<PackageTableSkeleton />}>
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
                  <Suspense fallback={<SkillTableSkeleton />}>
                    <SkillListWrapper skillsPromise={skillsPromise} />
                  </Suspense>
                </SurfaceCard>
              </PageContent>
            </TabsContent>

            <TabsContent value="categories" className="mt-0">
              <PageContent>
                <SurfaceCard>
                  <Suspense fallback={<CategoryTableSkeleton />}>
                    <CategoryListWrapper categoriesPromise={categoriesPromise} />
                  </Suspense>
                </SurfaceCard>
              </PageContent>
            </TabsContent>
          </Stack>
        </Tabs>
      </PageShell>
    );
  }
