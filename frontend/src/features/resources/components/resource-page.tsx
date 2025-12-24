"use client";

import {
  PageContent,
  PageHeader,
  PageShell,
  SurfaceCard,
} from "@/shared/components/layout/page-layout";
import { ActionResponse } from "@/shared/lib/action-response";
import { FilterBar } from "@/shared/ui/custom/filter-bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, use, useTransition } from "react";
import { MaintenanceTask, Resource, ResourceGroup } from "../model/types";
import { CreateResourceTrigger } from "./create-resource-trigger";
import { MaintenanceTimeline } from "./maintenance-timeline";
import { ResourceFilter } from "./resource-filter";
import { ResourceTable, ResourceTableSkeleton } from "./resource-table";
import { ResourceToolbar } from "./resource-toolbar";

interface ResourcePageProps {
  resourcesPromise: Promise<ActionResponse<Resource[]>>;
  groupsPromise: Promise<ActionResponse<ResourceGroup[]>>;
  tasksPromise: Promise<ActionResponse<MaintenanceTask[]>>;
}

function ResourceListWrapper({
  resourcesPromise,
  groupsPromise,
}: {
  resourcesPromise: Promise<ActionResponse<Resource[]>>;
  groupsPromise: Promise<ActionResponse<ResourceGroup[]>>;
}) {
  const { data: resources, errorMessage: resourcesError } = useActionData(
    resourcesPromise,
    []
  );
  const { data: groups } = useActionData(groupsPromise, []);

  if (resourcesError) {
    return (
      <div className="animate-pulse space-y-6 px-0 py-6">
        Lỗi tải tài nguyên: {resourcesError}
      </div>
    );
  }

  return (
    <ResourceTable
      data={resources}
      groups={groups}
      variant="flush"
      className="border-none"
    />
  );
}

function AddResourceWrapper({
  groupsPromise,
}: {
  groupsPromise: Promise<ActionResponse<ResourceGroup[]>>;
}) {
  const { data: groups } = useActionData(groupsPromise, []);
  return <CreateResourceTrigger groups={groups} />;
}

function MaintenanceTimelineWrapper({
  resourcesPromise,
  tasksPromise,
}: {
  resourcesPromise: Promise<ActionResponse<Resource[]>>;
  tasksPromise: Promise<ActionResponse<MaintenanceTask[]>>;
}) {
  const { data: resources } = useActionData(resourcesPromise, []);
  const { data: tasks } = useActionData(tasksPromise, []);

  return <MaintenanceTimeline resources={resources} tasks={tasks} />;
}

export function ResourcePage({
  resourcesPromise,
  groupsPromise,
  tasksPromise,
}: ResourcePageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Get active tab from URL or default to 'list'
  const activeTab = searchParams.get("view") || "list";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("view", value);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <PageShell>
      <Tabs
        value={activeTab}
        className="flex w-full flex-1 flex-col gap-0"
        onValueChange={handleTabChange}
      >
        <PageHeader>
          <TabsList variant="default" size="default" aria-label="Quản lý tài nguyên">
            <TabsTrigger value="list" variant="default" stretch={false}>
              Danh sách
            </TabsTrigger>
            <TabsTrigger value="maintenance" variant="default" stretch={false}>
              Lịch bảo trì
            </TabsTrigger>
          </TabsList>

          <div className="flex w-full items-center gap-3 md:w-auto">
            {activeTab === "list" && (
              <FilterBar
                startContent={<ResourceToolbar />}
                endContent={<ResourceFilter />}
              />
            )}
            <Suspense
              fallback={
                <div className="bg-muted h-9 w-[130px] animate-pulse rounded-md" />
              }
            >
              <AddResourceWrapper groupsPromise={groupsPromise} />
            </Suspense>
          </div>
        </PageHeader>

        <div className="page-entry-animation flex flex-1 flex-col overflow-hidden">
          <TabsContent
            value="list"
            className="mt-0 flex flex-1 flex-col border-0 p-0 data-[state=inactive]:hidden"
          >
            <PageContent>
              <SurfaceCard>
                <Suspense fallback={<ResourceTableSkeleton />}>
                  <ResourceListWrapper
                    resourcesPromise={resourcesPromise}
                    groupsPromise={groupsPromise}
                  />
                </Suspense>
              </SurfaceCard>
            </PageContent>
          </TabsContent>

          <TabsContent
            value="maintenance"
            className="mt-0 flex flex-1 flex-col border-0 p-0 data-[state=inactive]:hidden"
          >
            <PageContent>
              <SurfaceCard className="p-0">
                <Suspense
                  fallback={
                    <div className="text-muted-foreground p-4 text-center">
                      Đang tải lịch bảo trì...
                    </div>
                  }
                >
                  <MaintenanceTimelineWrapper
                    resourcesPromise={resourcesPromise}
                    tasksPromise={tasksPromise}
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

function useActionData<T>(
  promise: Promise<ActionResponse<T>>,
  fallback: T
): { data: T; errorMessage?: string } {
  const res = use(promise);

  if (res.status === "success") {
    return { data: res.data ?? fallback };
  }

  if (res.status === "error") {
    return { data: fallback, errorMessage: res.message };
  }

  return { data: fallback };
}
