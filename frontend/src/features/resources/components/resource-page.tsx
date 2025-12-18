"use client";

import { PageFooter } from "@/shared/components/layout/components/page-footer";
import {
  PageContent,
  PageHeader,
  PageShell,
  SurfaceCard,
} from "@/shared/components/layout/page-layout";
import { ActionResponse } from "@/shared/lib/action-response";
import { FilterBar } from "@/shared/ui/custom/filter-bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

import { Suspense, use, useState } from "react";
import { MaintenanceTask, Resource, ResourceGroup } from "../types";
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
      <div className="p-4 text-destructive">
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
  const [activeTab, setActiveTab] = useState("list");

  return (
    <PageShell>
      <Tabs
        defaultValue="list"
        className="flex flex-col flex-1 w-full gap-0"
        onValueChange={setActiveTab}
      >
        <PageHeader>
          <TabsList variant="default" size="default">
            <TabsTrigger value="list" variant="default" stretch={false}>
              Danh sách
            </TabsTrigger>
            <TabsTrigger value="maintenance" variant="default" stretch={false}>
              Lịch bảo trì
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {activeTab === "list" && (
              <FilterBar
                startContent={<ResourceToolbar />}
                endContent={<ResourceFilter />}
              />
            )}
            <Suspense
              fallback={
                <div className="w-[130px] h-9 bg-muted animate-pulse rounded-md" />
              }
            >
              <AddResourceWrapper groupsPromise={groupsPromise} />
            </Suspense>
          </div>
        </PageHeader>

        <div className="flex-1 flex flex-col overflow-hidden page-entry-animation">
          <TabsContent
            value="list"
            className="flex-1 flex flex-col mt-0 border-0 p-0 data-[state=inactive]:hidden"
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
              <PageFooter />
            </PageContent>
          </TabsContent>

          <TabsContent
            value="maintenance"
            className="flex-1 flex flex-col mt-0 border-0 p-0 data-[state=inactive]:hidden"
          >
            <PageContent>
              <SurfaceCard className="p-4">
                <Suspense
                  fallback={
                    <div className="p-4 text-center text-muted-foreground">
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
              <PageFooter />
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
