"use server";

import { ActionResponse, error } from "@/shared/lib/action-response";
import { revalidateTag } from "next/cache";
import {
  createServiceApi,
  createServiceCategoryApi,
  createSkillApi,
  deleteServiceApi,
  deleteServiceCategoryApi,
  deleteSkillApi,
  updateServiceApi,
  updateServiceCategoryApi,
  updateSkillApi,
} from "./services.api";
import { serviceSchema } from "./model/schemas";
import {
  Service,
  ServiceCategory,
  ServiceCreateInput,
  Skill,
} from "./model/types";

/**
 * Tạo dịch vụ mới
 */
export async function createService(
  data: ServiceCreateInput
): Promise<ActionResponse<Service>> {
  const validation = serviceSchema.safeParse(data);
  if (!validation.success)
    return error(
      "Dữ liệu không hợp lệ",
      validation.error.flatten().fieldErrors
    );

  const result = await createServiceApi(data);
  if (result.status === "success") {
    revalidateTag("services", "max");
  }
  return result;
}

/**
 * Cập nhật dịch vụ
 */
export async function updateService(
  id: string,
  data: Partial<ServiceCreateInput>
): Promise<ActionResponse<Service>> {
  const result = await updateServiceApi(id, data);
  if (result.status === "success") {
    revalidateTag("services", "max");
    revalidateTag(`service-${id}`, "max");
  }
  return result;
}

/**
 * Xóa dịch vụ (Soft delete)
 */
export async function deleteService(id: string): Promise<ActionResponse<void>> {
  const result = await deleteServiceApi(id);
  if (result.status === "success") {
    revalidateTag("services", "max");
    revalidateTag(`service-${id}`, "max");
  }
  return result;
}

/**
 * Bật/Tắt trạng thái hoạt động
 */
export async function toggleServiceStatus(
  id: string,
  isActive: boolean
): Promise<ActionResponse<Service>> {
  return updateService(id, { is_active: isActive });
}

// CATEGORIES

/**
 * Tạo danh mục mới
 */
export async function createServiceCategory(
  name: string,
  sortOrder = 0
): Promise<ActionResponse<ServiceCategory>> {
  const result = await createServiceCategoryApi(name, sortOrder);
  if (result.status === "success") {
    revalidateTag("service-categories", "max");
  }
  return result;
}

/**
 * Cập nhật danh mục
 */
export async function updateServiceCategory(
  id: string,
  name: string,
  sortOrder: number
): Promise<ActionResponse<ServiceCategory>> {
  const result = await updateServiceCategoryApi(id, name, sortOrder);
  if (result.status === "success") {
    revalidateTag("service-categories", "max");
  }
  return result;
}

/**
 * Xóa danh mục
 */
export async function deleteServiceCategory(
  id: string
): Promise<ActionResponse<void>> {
  const result = await deleteServiceCategoryApi(id);
  if (result.status === "success") {
    revalidateTag("service-categories", "max");
  }
  return result;
}

// SKILLS

/**
 * Tạo kỹ năng mới
 */
export async function createSkill(
  name: string,
  code: string,
  description?: string
): Promise<ActionResponse<Skill>> {
  const result = await createSkillApi(name, code, description);
  if (result.status === "success") {
    revalidateTag("skills", "max");
  }
  return result;
}

/**
 * Cập nhật kỹ năng
 */
export async function updateSkill(
  id: string,
  data: { name?: string; code?: string; description?: string }
): Promise<ActionResponse<Skill>> {
  const result = await updateSkillApi(id, data);
  if (result.status === "success") {
    revalidateTag("skills", "max");
  }
  return result;
}

/**
 * Xóa kỹ năng
 */
export async function deleteSkill(id: string): Promise<ActionResponse<void>> {
  const result = await deleteSkillApi(id);
  if (result.status === "success") {
    revalidateTag("skills", "max");
  }
  return result;
}
