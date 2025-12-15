"use server";

import { ActionResponse, error, success } from "@/shared/lib/action-response";
import { revalidatePath } from "next/cache";
import {
  mockMaintenanceTasks,
  mockResourceGroups,
  mockResources,
} from "./data/mocks";
import { ResourceFormValues, resourceSchema } from "./schemas";
import { MaintenanceTask, Resource, ResourceGroup } from "./types";

let resources = [...mockResources];
const resourceGroups = [...mockResourceGroups];
const maintenanceTasks = [...mockMaintenanceTasks];

export async function manageResource(
  prevState: unknown,
  formData: FormData
): Promise<ActionResponse> {
  const id = formData.get("id") as string;
  const rawData = buildResourcePayload(formData);

  const validatedFields = resourceSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return error(
      "Dữ liệu không hợp lệ",
      validatedFields.error.flatten().fieldErrors
    );
  }

  try {
    if (id) {
      await updateResource(id, validatedFields.data);
      return success(undefined, "Cập nhật tài nguyên thành công");
    }

    await createResource(validatedFields.data);
    return success(undefined, "Tạo tài nguyên mới thành công");
  } catch (_err) {
    return error("Đã có lỗi xảy ra");
  }
}

export async function getResources(
  query?: string
): Promise<ActionResponse<Resource[]>> {
  if (!query) return success(resources);
  const lowerQuery = query.toLowerCase();
  return success(
    resources.filter(
      (r) =>
        r.name.toLowerCase().includes(lowerQuery) ||
        r.code.toLowerCase().includes(lowerQuery)
    )
  );
}

export async function getResourceGroups(): Promise<
  ActionResponse<ResourceGroup[]>
> {
  return success(resourceGroups);
}

export async function getResourceById(
  id: string
): Promise<Resource | undefined> {
  return resources.find((r) => r.id === id);
}

export async function createResource(
  data: ResourceFormValues
): Promise<Resource> {
  const newResource: Resource = {
    id: Math.random().toString(36).substring(7),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...data,
    capacity: data.type === "ROOM" ? data.capacity : undefined,
  } as Resource;

  resources = [newResource, ...resources];
  revalidatePath("/resources");
  return newResource;
}

export async function updateResource(
  id: string,
  data: ResourceFormValues
): Promise<Resource> {
  const index = resources.findIndex((r) => r.id === id);
  if (index === -1) throw new Error("Resource not found");

  const updatedResource = {
    ...resources[index],
    ...data,
    updatedAt: new Date().toISOString(),
    capacity: data.type === "ROOM" ? data.capacity : undefined,
  } as Resource;

  resources[index] = updatedResource;
  revalidatePath("/resources");
  return updatedResource;
}

export async function deleteResource(id: string): Promise<ActionResponse> {
  resources = resources.filter((r) => r.id !== id);
  revalidatePath("/resources");
  return success(undefined, "Đã xóa tài nguyên thành công");
}

export async function getRoomTypes(): Promise<ActionResponse<Resource[]>> {
  const res = await getResources();
  if (res.status === "success" && res.data) {
    return success(res.data.filter((r) => r.type === "ROOM"));
  }
  return error(res.message || "Không thể tải loại phòng");
}

export async function getEquipmentList(): Promise<ActionResponse<Resource[]>> {
  const res = await getResources();
  if (res.status === "success" && res.data) {
    return success(res.data.filter((r) => r.type === "EQUIPMENT"));
  }
  return error(res.message || "Không thể tải danh sách thiết bị");
}

export async function getMaintenanceTasks(): Promise<
  ActionResponse<MaintenanceTask[]>
> {
  return success(maintenanceTasks);
}

function buildResourcePayload(formData: FormData): Record<string, unknown> {
  const rawData: Record<string, unknown> = {};

  formData.forEach((value, key) => {
    if (key === "id" || key === "form_mode") return;
    if (key === "tags") {
      try {
        rawData[key] = JSON.parse(value as string);
      } catch {
        rawData[key] = [];
      }
      return;
    }

    rawData[key] = value;
  });

  return rawData;
}
