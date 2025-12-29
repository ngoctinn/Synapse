"use client";

import dynamic from "next/dynamic";
import {
  PackageTableSkeleton,
} from "@/features/packages";
import {
  PageContent,
  PageHeader,
  PageShell,
  SurfaceCard,
} from "@/shared/components/layout/page-layout";
import { Stack } from "@/shared/ui/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, use, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import { CategoryTableSkeleton } from "./category-table";
import { ServiceTableSkeleton } from "./service-table";
import { SkillTableSkeleton } from "./skill-table";

// Types
import { ActionResponse } from "@/shared/lib/action-response";
import { ServicePagination, ServiceCategory, Skill } from "../model/types";
import { ResourceGroup } from "@/features/resources/model/types";
import { PaginatedPackages } from "@/features/packages/model/types";

// Dynamic imports
const PackageTable = dynamic(
  () =>
    import("@/features/packages").then(
      (mod) => mod.PackageTable
    ),
  {
    loading: () => <PackageTableSkeleton />,
  }
);
const ServiceTable = dynamic(
  () => import("./service-table").then((mod) => mod.ServiceTable),
  {
    loading: () => <ServiceTableSkeleton />,
  }
);
const CategoryTable = dynamic(
  () => import("./category-table").then((mod) => mod.CategoryTable),
  {
    loading: () => <CategoryTableSkeleton />,
  }
);
const SkillTable = dynamic(
  () => import("./skill-table").then((mod) => mod.SkillTable),
  {
    loading: () => <SkillTableSkeleton />,
  }
);

interface ServicesPageProps {
  page: number;
  search: string;
  servicesPromise?: Promise<ActionResponse<ServicePagination>>;
  skillsPromise?: Promise<ActionResponse<Skill[]>>;
  categoriesPromise?: Promise<ActionResponse<ServiceCategory[]>>;
  resourceGroupsPromise?: Promise<ActionResponse<ResourceGroup[]>>;
  packagesPromise?: Promise<ActionResponse<PaginatedPackages>>;
  allServicesPromise?: Promise<ActionResponse<ServicePagination>>;
}

function ServiceListWrapper({
  page,
  searchProps,
  servicesPromise,
  skillsPromise,
  categoriesPromise,
  resourceGroupsPromise,
}: {
  page: number;
  searchProps: {
    initialValue: string;
    onSearch: (term: string) => void;
  };
  servicesPromise: Promise<ActionResponse<ServicePagination>>;
  skillsPromise: Promise<ActionResponse<Skill[]>>;
  categoriesPromise: Promise<ActionResponse<ServiceCategory[]>>;
  resourceGroupsPromise: Promise<ActionResponse<ResourceGroup[]>>;
}) {
  const servicesRes = use(servicesPromise);
  const skillsRes = use(skillsPromise);
  const categoriesRes = use(categoriesPromise);
  const resourceGroupsRes = use(resourceGroupsPromise);

  if (servicesRes.status === "error") {
    return (
      <div className="text-destructive p-4 text-center">
        Lỗi tải dữ liệu: {servicesRes.message}
      </div>
    );
  }

  const skills = skillsRes.status === "success" ? skillsRes.data || [] : [];
  const categories =
    categoriesRes.status === "success" ? categoriesRes.data || [] : [];
  const resourceGroups =
    resourceGroupsRes.status === "success" ? resourceGroupsRes.data || [] : [];

  const { data, total } = servicesRes.data!;
  const totalPages = Math.ceil(total / 10);

  return (
    <ServiceTable
      services={data}
      availableSkills={skills}
      availableCategories={categories}
      availableResourceGroups={resourceGroups}
      page={page}
      totalPages={totalPages}
      searchProps={searchProps}
    />
  );
}

function PackageListWrapper({
  page,
  packagesPromise,
  allServicesPromise,
}: {
  page: number;
  packagesPromise: Promise<ActionResponse<PaginatedPackages>>;
  allServicesPromise: Promise<ActionResponse<ServicePagination>>;
}) {
  const packagesPromiseRes = use(packagesPromise);
  const servicesRes = use(allServicesPromise);

  if (packagesPromiseRes.status === "error") {
    return (
      <div className="text-destructive p-4 text-center">
        Lỗi tải gói dịch vụ: {packagesPromiseRes.message}
      </div>
    );
  }

  const { data, total } = packagesPromiseRes.data!;
  const totalPages = Math.ceil(total / 10);
  const availableServices =
    servicesRes.status === "success" ? servicesRes.data!.data : [];

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
  const categoriesRes = use(categoriesPromise);

  if (categoriesRes.status === "error") {
    return (
      <div className="text-destructive p-4 text-center">
        Lỗi tải danh mục: {categoriesRes.message}
      </div>
    );
  }

  const categories = categoriesRes.data || [];

  return <CategoryTable categories={categories} />;
}

function SkillListWrapper({
  skillsPromise,
}: {
  skillsPromise: Promise<ActionResponse<Skill[]>>;
}) {
  const skillsRes = use(skillsPromise);

  if (skillsRes.status === "error") {
    return (
      <div className="text-destructive p-4 text-center">
        Lỗi tải kỹ năng: {skillsRes.message}
      </div>
    );
  }

  const skills = skillsRes.data || [];

  return <SkillTable skills={skills} />;
}

export function ServicesPage({
  page,
  search,
  servicesPromise,
  skillsPromise,
  categoriesPromise,
  resourceGroupsPromise,
  packagesPromise,
  allServicesPromise,
}: ServicesPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [, startTransition] = useTransition();

  // Get active tab from URL or default to 'list'
  const activeTab = searchParams.get("view") || "list";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("view", value);
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
        <PageHeader title="Quản lý dịch vụ">
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
              value="categories"
              aria-label="Danh mục dịch vụ"
              stretch={false}
            >
              Danh mục
            </TabsTrigger>
            <TabsTrigger
              value="skills"
              aria-label="Kỹ năng kỹ thuật viên"
              stretch={false}
            >
              Kỹ năng
            </TabsTrigger>
          </TabsList>
        </PageHeader>

        <Stack gap={0} className="page-entry-animation">
          {activeTab === "list" && servicesPromise && skillsPromise && categoriesPromise && resourceGroupsPromise && (
            <TabsContent value="list" className="mt-0">
              <PageContent>
                <SurfaceCard>
                  <Suspense fallback={<ServiceTableSkeleton />}>
                    <ServiceListWrapper
                      page={page}
                      searchProps={{
                        initialValue: search,
                        onSearch: handleSearch,
                      }}
                      servicesPromise={servicesPromise}
                      skillsPromise={skillsPromise}
                      categoriesPromise={categoriesPromise}
                      resourceGroupsPromise={resourceGroupsPromise}
                    />
                  </Suspense>
                </SurfaceCard>
              </PageContent>
            </TabsContent>
          )}

          {activeTab === "packages" && packagesPromise && allServicesPromise && (
            <TabsContent value="packages" className="mt-0">
              <PageContent>
                <SurfaceCard>
                  <Suspense fallback={<PackageTableSkeleton />}>
                    <PackageListWrapper
                      page={page}
                      packagesPromise={packagesPromise}
                      allServicesPromise={allServicesPromise}
                    />
                  </Suspense>
                </SurfaceCard>
              </PageContent>
            </TabsContent>
          )}

          {activeTab === "categories" && categoriesPromise && (
            <TabsContent value="categories" className="mt-0">
              <PageContent>
                <SurfaceCard>
                  <Suspense fallback={<CategoryTableSkeleton />}>
                    <CategoryListWrapper categoriesPromise={categoriesPromise} />
                  </Suspense>
                </SurfaceCard>
              </PageContent>
            </TabsContent>
          )}

          {activeTab === "skills" && skillsPromise && (
            <TabsContent value="skills" className="mt-0">
              <PageContent>
                <SurfaceCard>
                  <Suspense fallback={<SkillTableSkeleton />}>
                    <SkillListWrapper skillsPromise={skillsPromise} />
                  </Suspense>
                </SurfaceCard>
              </PageContent>
            </TabsContent>
          )}
        </Stack>
      </Tabs>
    </PageShell>
  );
}