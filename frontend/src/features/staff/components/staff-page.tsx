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
import { Input } from "@/shared/ui/input";
import { Group, Stack } from "@/shared/ui/layout";
import { Box } from "@/shared/ui/layout/box";
import { Skeleton } from "@/shared/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Text as UIText } from "@/shared/ui/typography";
import { Search } from "lucide-react";
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
  /** Cho phép hiển thị nút tạo/sửa/xóa nhân viên (chỉ Manager) */
  canManageStaff?: boolean;
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
      <Box className="p-4">
        <UIText variant="error">
          Lỗi tải danh sách nhân viên: {response.message}
        </UIText>
      </Box>
    );
  }

  return (
    <StaffTable
      data={data}
      skills={skills}
      page={page}
      totalPages={totalPages}
      variant="flush"

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
  canManageStaff = false,
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
      <Stack gap={0} asChild>
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
        >
        <PageHeader>
          <TabsList size="default" aria-label="Quản lý nhân viên">
            <TabsTrigger value="list" stretch={false}>
              Danh sách
            </TabsTrigger>
            <TabsTrigger value="permissions" stretch={false}>
              Phân quyền
            </TabsTrigger>
            <TabsTrigger value="scheduling" stretch={false}>
              Lịch làm việc
            </TabsTrigger>
          </TabsList>

          <Group gap={3} className="w-full md:w-auto">
            {activeTab === "list" && (
              <FilterBar
                startContent={
                  <div className="w-full md:w-[250px]">
                    <Input
                      placeholder="Tìm kiếm nhân viên..."
                      defaultValue={initialSearch}
                      onChange={(e) => handleSearch(e.target.value)}
                      startContent={<Search className="text-muted-foreground" size={16} />}
                      isSearch
                    />
                  </div>
                }
                endContent={<StaffFilter />}
              />
            )}
            {activeTab === "list" && canManageStaff && (
              <InviteStaffTrigger skills={skills} />
            )}
          </Group>
        </PageHeader>

        <Stack gap={0} className="page-entry-animation min-h-0 overflow-hidden">
          <TabsContent
            value="list"
            className="mt-0 data-[state=inactive]:hidden"
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
            className="mt-0 data-[state=inactive]:hidden"
          >
            <PageContent>
              <SurfaceCard>
                <PermissionMatrix
                  initialPermissions={initialPermissions}

                />
              </SurfaceCard>
            </PageContent>
          </TabsContent>

          <TabsContent
            value="scheduling"
            className="flex min-h-0 flex-1 flex-col overflow-hidden data-[state=inactive]:hidden"
          >
            <Suspense
              fallback={
                <Stack gap={4} className="p-0 flex-1">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-9 w-48" />
                    <div className="flex gap-2">
                       <Skeleton className="h-9 w-24" />
                       <Skeleton className="h-9 w-24" />
                    </div>
                  </div>
                  <Skeleton className="min-h-[300px] w-full flex-1 border border-dashed rounded-lg" />
                </Stack>
              }
            >
              <StaffSchedulerWrapper
                staffListPromise={staffListPromise}
                initialSchedules={initialSchedules}
              />
            </Suspense>
          </TabsContent>
        </Stack>
      </Tabs>
    </Stack>
  </PageShell>
  );
}
