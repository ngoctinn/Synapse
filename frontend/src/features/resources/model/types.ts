export type ResourceType = "ROOM" | "EQUIPMENT";
export type ResourceStatus = "ACTIVE" | "MAINTENANCE" | "INACTIVE";

export interface ResourceGroup {
  id: string;
  name: string;
  type: ResourceType;
  description?: string;
}

export interface Resource {
  id: string;
  groupId: string;
  name: string;
  code: string;
  type: ResourceType;
  status: ResourceStatus;
  capacity?: number;
  description?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  image?: string;
  setupTime?: number;
}

export type RoomType = Resource;

export type MaintenanceStatus =
  | "scheduled"
  | "in_progress"
  | "completed"
  | "overdue"
  | "skipped";
export type MaintenanceFrequency = "daily" | "weekly" | "monthly" | "yearly";

export interface MaintenanceTask {
  id: string;
  resourceId: string;
  title: string;
  date: string;
  status: MaintenanceStatus;
  assignedTo?: string;
  notes?: string;
}
