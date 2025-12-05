export type ResourceType = 'ROOM' | 'EQUIPMENT';
export type ResourceStatus = 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';

export interface Resource {
  id: string;
  name: string;
  code: string;
  type: ResourceType;
  status: ResourceStatus;
  capacity?: number; // Only relevant for rooms
  description?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  image?: string; // Added for Avatar/Image support
}

export type RoomType = Resource;

// Maintenance Types
export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'overdue' | 'skipped';
export type MaintenanceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface MaintenanceTask {
  id: string;
  resourceId: string;
  title: string;
  date: string; // ISO Date string
  status: MaintenanceStatus;
  assignedTo?: string; // Staff ID
  notes?: string;
}
