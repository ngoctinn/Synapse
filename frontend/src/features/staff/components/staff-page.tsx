"use client";

import { Skill } from "@/features/services";
import {
  PageContent,
  PageHeader,
  PageShell,
  SurfaceCard,
} from "@/shared/components/layout/page-layout";
import { ActionResponse } from "@/shared/lib/action-response";
import { FilterBar } from "@/shared/ui/custom/filter-bar";
import { SearchInput } from "@/shared/ui/custom/search-input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, use, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import { InviteStaffTrigger } from "./invite-staff-trigger";
import { PermissionMatrix } from "./permissions/permission-matrix";
import { StaffSchedulingPage } from "./scheduling";
import { StaffFilter } from "./staff-filter";
import { StaffTable, StaffTableSkeleton } from "./staff-list/staff-table";

import { Schedule, StaffListResponse } from "../model/types";

interface StaffPageProps {
  page: number;
  skills: Skill[];
  staffListPromise: Promise<ActionResponse<StaffListResponse>>;
  initialPermissions: Record<string, Record<string, boolean>>;
  initialSchedules: Schedule[];
}

function StaffListWrapper({
  staffListPromise,
  skills,
  page,
}: {
  staffListPromise: Promise<ActionResponse<StaffListResponse>>;
  skills: Skill[];
  page: number;
}) {
  const response = use(staffListPromise);

  const { data, total } =
    response.status === "success" && response.data
      ? response.data
      : { data: [], total: 0 };

  const totalPages = Math.ceil(total / 10);

  if (response.status === "error") {
    return (
      <div className="text-destructive p-4">
        Lỗi tải danh sách nhân viên: {response.message}
      </div>
    );
  }

  return (
    <StaffTable
      data={data}
      skills={skills}
      page={page}
      totalPages={totalPages}
      variant="flush"
      className="border-none"
      hidePagination={false}
    />
  );
}


function StaffSchedulerWrapper({
  staffListPromise,
  initialSchedules,
}: {
  staffListPromise: Promise<ActionResponse<StaffListResponse>>;
  initialSchedules: Schedule[];
}) {
  const response = use(staffListPromise);
  const staffData =
    response.status === "success" && response.data ? response.data.data : [];

  return (
    <StaffSchedulingPage
      initialSchedules={initialSchedules}
      staffList={staffData}
    />
  );
}

export function StaffPage({
  page,
  skills,
  staffListPromise,
  initialPermissions,
  initialSchedules,
}: StaffPageProps) {
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
    <PageShell
      className={
        activeTab === "scheduling" ? "h-screen overflow-hidden" : undefined
      }
    >
      <Tabs
        value={activeTab}
        className="flex w-full flex-1 flex-col gap-0"
        onValueChange={handleTabChange}
      >
        <PageHeader>
          <TabsList variant="default" size="default" aria-label="Quản lý nhân viên">
            <TabsTrigger value="list" variant="default" stretch={false}>
              Danh sách
            </TabsTrigger>
            <TabsTrigger value="permissions" variant="default" stretch={false}>
              Phân quyền
            </TabsTrigger>
            <TabsTrigger value="scheduling" variant="default" stretch={false}>
              Lịch làm việc
            </TabsTrigger>
          </TabsList>

          <div className="flex w-full items-center gap-3 md:w-auto">
            {activeTab === "list" && (
              <FilterBar
                startContent={
                  <SearchInput
                    placeholder="Tìm kiếm nhân viên..."
                    defaultValue={initialSearch}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                }
                endContent={<StaffFilter />}
              />
            )}
            {activeTab === "list" && <InviteStaffTrigger skills={skills} />}
          </div>
        </PageHeader>

        <div className="page-entry-animation flex min-h-0 flex-1 flex-col overflow-hidden">
          <TabsContent
            value="list"
            className="mt-0 flex flex-1 flex-col border-0 p-0 data-[state=inactive]:hidden"
          >
            <PageContent>
              <SurfaceCard>
                <Suspense fallback={<StaffTableSkeleton />}>
                  <StaffListWrapper
                    staffListPromise={staffListPromise}
                    skills={skills}
                    page={page}
                  />
                </Suspense>
              </SurfaceCard>
            </PageContent>
          </TabsContent>

          <TabsContent
            value="permissions"
            className="mt-0 flex flex-1 flex-col border-0 p-0 data-[state=inactive]:hidden"
          >
            <PageContent>
              <SurfaceCard>
                <PermissionMatrix
                  initialPermissions={initialPermissions}
                  className="border-none"
                />
              </SurfaceCard>
            </PageContent>
          </TabsContent>

          <TabsContent
            value="scheduling"
            className="mt-0 flex min-h-0 flex-1 flex-col overflow-hidden border-0 p-0 data-[state=inactive]:hidden"
          >
            <Suspense
              fallback={
                <div className="flex flex-1 flex-col space-y-4 p-0">
                  <div className="flex items-center justify-between">
                    <div className="bg-muted h-10 w-48 animate-pulse rounded" />
                    <div className="flex gap-2">
                      <div className="bg-muted h-10 w-24 animate-pulse rounded" />
                      <div className="bg-muted h-10 w-24 animate-pulse rounded" />
                    </div>
                  </div>
                  <div className="bg-muted/20 border-muted min-h-[300px] w-full flex-1 animate-pulse rounded-lg border border-dashed" />
                </div>
              }
            >
              <StaffSchedulerWrapper
                staffListPromise={staffListPromise}
                initialSchedules={initialSchedules}
              />
            </Suspense>
          </TabsContent>
        </div>
      </Tabs>
    </PageShell>
  );
}
