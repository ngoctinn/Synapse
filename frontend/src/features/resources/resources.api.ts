import "server-only";

import { cache } from "react";
import { ActionResponse, success } from "@/shared/lib/action-response";
import {
  mockResourceGroups,
  mockResources,
  mockMaintenanceTasks,
} from "./model/mocks";
import { Resource, ResourceGroup, MaintenanceTask } from "./model/types";

// Note: Using mock data for now. In production, these should be fetch calls with tags.

export const getResources = cache(async (
  query?: string
): Promise<ActionResponse<Resource[]>> => {
  if (!query) return success(mockResources);
  const lowerQuery = query.toLowerCase();
  return success(
    mockResources.filter(
      (r) =>
        r.name.toLowerCase().includes(lowerQuery) ||
        r.code.toLowerCase().includes(lowerQuery)
    )
  );
});

export const getResourceGroups = cache(async (): Promise<
  ActionResponse<ResourceGroup[]>
> => {
  return success(mockResourceGroups);
});

export const getMaintenanceTasks = cache(async (): Promise<
  ActionResponse<MaintenanceTask[]>
> => {
  return success(mockMaintenanceTasks);
});
