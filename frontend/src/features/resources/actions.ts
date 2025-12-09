"use server";

import { revalidatePath } from "next/cache";
import { mockMaintenanceTasks, mockResourceGroups, mockResources } from "./data/mocks";
import { ResourceFormValues, resourceSchema } from "./schemas";
import { MaintenanceTask, Resource, ResourceGroup } from "./types";

export type ActionState = {
  success?: boolean;
  error?: string;
  message?: string;
};

// Simulate a database
let resources = [...mockResources];
let resourceGroups = [...mockResourceGroups];
let maintenanceTasks = [...mockMaintenanceTasks];

export async function manageResource(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const id = formData.get("id") as string;
    const rawData: any = {};

    // Parse form data
    formData.forEach((value, key) => {
        if (key === "tags") {
            try {
                rawData[key] = JSON.parse(value as string);
            } catch {
                rawData[key] = [];
            }
        } else if (key !== "id" && key !== "form_mode") {
             // Basic casting
             rawData[key] = value;
        }
    });

    // Handle number conversions manually as FormData is string
    if (rawData.capacity) rawData.capacity = Number(rawData.capacity);
    if (rawData.setupTime) rawData.setupTime = Number(rawData.setupTime);

    // Validate
    const validatedFields = resourceSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.issues[0].message
        };
    }

    try {
        if (id) {
            await updateResource(id, validatedFields.data);
            return { success: true, message: "Cập nhật tài nguyên thành công" };
        } else {
            await createResource(validatedFields.data);
            return { success: true, message: "Tạo tài nguyên mới thành công" };
        }
    } catch (error) {
        return { success: false, error: "Đã có lỗi xảy ra" };
    }
}

export async function getResources(query?: string): Promise<Resource[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!query) return resources;

  const lowerQuery = query.toLowerCase();
  return resources.filter(
    (r) =>
      r.name.toLowerCase().includes(lowerQuery) ||
      r.code.toLowerCase().includes(lowerQuery)
  );
}

export async function getResourceGroups(): Promise<ResourceGroup[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return resourceGroups;
}

export async function getResourceById(id: string): Promise<Resource | undefined> {
  return resources.find((r) => r.id === id);
}

export async function createResource(data: ResourceFormValues): Promise<Resource> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newResource: Resource = {
    id: Math.random().toString(36).substring(7),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...data,
    // Ensure capacity is undefined if not a room
    capacity: data.type === 'ROOM' ? data.capacity : undefined,
  } as Resource;

  resources = [newResource, ...resources];
  revalidatePath("/resources");
  return newResource;
}

export async function updateResource(id: string, data: ResourceFormValues): Promise<Resource> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const index = resources.findIndex((r) => r.id === id);
  if (index === -1) throw new Error("Resource not found");

  const updatedResource = {
    ...resources[index],
    ...data,
    updatedAt: new Date().toISOString(),
    capacity: data.type === 'ROOM' ? data.capacity : undefined,
  } as Resource;

  resources[index] = updatedResource;
  revalidatePath("/resources");
  return updatedResource;
}

export async function deleteResource(id: string): Promise<ActionState> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  resources = resources.filter((r) => r.id !== id);
  revalidatePath("/resources");
  return { success: true, message: "Đã xóa tài nguyên thành công" };
}

// --- Compatibility Exports (Deprecated) ---

export async function getRoomTypes(): Promise<Resource[]> {
  // Return all resources of type ROOM
  return getResources().then(res => res.filter(r => r.type === 'ROOM'));
}

export async function getEquipmentList(): Promise<Resource[]> {
  // Return all resources of type EQUIPMENT
  return getResources().then(res => res.filter(r => r.type === 'EQUIPMENT'));
}

export async function getMaintenanceTasks(): Promise<MaintenanceTask[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return maintenanceTasks;
}
