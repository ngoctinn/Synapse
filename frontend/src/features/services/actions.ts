"use server";

import { ActionResponse, error, success } from "@/shared/lib/action-response";
import { fetchWithAuth } from "@/shared/lib/api";
import { revalidatePath } from "next/cache";
import { serviceSchema } from "./model/schemas";
import {
  Service,
  ServiceCategory,
  ServiceCreateInput,
  ServicePagination,
  Skill,
} from "./model/types";

// ============================================================================
// SERVICES
// ============================================================================

/**
 * Lấy danh sách dịch vụ (phân trang, tìm kiếm)
 */
export async function getServices(
  page = 1,
  limit = 10,
  search?: string,
  activeOnly = false
): Promise<ActionResponse<ServicePagination>> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      active: activeOnly.toString(),
    });
    if (search) params.append("search", search);

    const response = await fetchWithAuth(`/services?${params.toString()}`);
    if (!response.ok) return error("Không thể tải danh sách dịch vụ");

    const result = await response.json();
    return success(result);
  } catch (err) {
    console.error("getServices error:", err);
    return error("Lỗi kết nối máy chủ");
  }
}

/**
 * Lấy chi tiết dịch vụ
 */
export async function getService(id: string): Promise<ActionResponse<Service>> {
  try {
    const response = await fetchWithAuth(`/services/${id}`);
    if (!response.ok) {
      if (response.status === 404) return error("Dịch vụ không tồn tại");
      return error("Không thể tải thông tin dịch vụ");
    }

    const result = await response.json();
    return success(result);
  } catch (err) {
    return error("Lỗi kết nối máy chủ");
  }
}

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

  try {
    const response = await fetchWithAuth("/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return error(errData.detail || "Không thể tạo dịch vụ");
    }

    const result = await response.json();
    revalidatePath("/admin/services");
    return success(result, "Tạo dịch vụ thành công");
  } catch (err) {
    return error("Lỗi kết nối máy chủ");
  }
}

/**
 * Cập nhật dịch vụ
 */
export async function updateService(
  id: string,
  data: Partial<ServiceCreateInput>
): Promise<ActionResponse<Service>> {
  try {
    const response = await fetchWithAuth(`/services/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return error(errData.detail || "Không thể cập nhật dịch vụ");
    }

    const result = await response.json();
    revalidatePath("/admin/services");
    return success(result, "Cập nhật dịch vụ thành công");
  } catch (err) {
    return error("Lỗi kết nối máy chủ");
  }
}

/**
 * Xóa dịch vụ (Soft delete)
 */
export async function deleteService(id: string): Promise<ActionResponse<void>> {
  try {
    const response = await fetchWithAuth(`/services/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) return error("Không thể xóa dịch vụ");

    revalidatePath("/admin/services");
    return success(undefined, "Đã xóa dịch vụ");
  } catch (err) {
    return error("Lỗi kết nối máy chủ");
  }
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

// ============================================================================
// CATEGORIES
// ============================================================================

/**
 * Lấy danh sách danh mục
 */
export async function getServiceCategories(): Promise<
  ActionResponse<ServiceCategory[]>
> {
  try {
    const response = await fetchWithAuth("/services/categories");
    if (!response.ok) return error("Không thể tải danh sách danh mục");

    const result = await response.json();
    return success(result);
  } catch (err) {
    return error("Lỗi kết nối máy chủ");
  }
}

/**
 * Tạo danh mục mới
 */
export async function createServiceCategory(
  name: string,
  sortOrder = 0
): Promise<ActionResponse<ServiceCategory>> {
  try {
    const response = await fetchWithAuth("/services/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, sort_order: sortOrder }),
    });

    if (!response.ok) return error("Không thể tạo danh mục");

    const result = await response.json();
    revalidatePath("/admin/services");
    return success(result, "Đã tạo danh mục");
  } catch (err) {
    return error("Lỗi kết nối máy chủ");
  }
}

/**
 * Cập nhật danh mục
 */
export async function updateServiceCategory(
  id: string,
  name: string,
  sortOrder: number
): Promise<ActionResponse<ServiceCategory>> {
  try {
    const response = await fetchWithAuth(`/services/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, sort_order: sortOrder }),
    });

    if (!response.ok) return error("Không thể cập nhật danh mục");

    const result = await response.json();
    revalidatePath("/admin/services");
    return success(result, "Đã cập nhật danh mục");
  } catch (err) {
    return error("Lỗi kết nối máy chủ");
  }
}

/**
 * Xóa danh mục
 */
export async function deleteServiceCategory(
  id: string
): Promise<ActionResponse<void>> {
  try {
    const response = await fetchWithAuth(`/services/categories/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) return error("Không thể xóa danh mục");

    revalidatePath("/admin/services");
    return success(undefined, "Đã xóa danh mục");
  } catch (err) {
    return error("Lỗi kết nối máy chủ");
  }
}

// ============================================================================
// SKILLS
// ============================================================================

/**
 * Lấy danh sách kỹ năng
 */
export async function getSkills(): Promise<ActionResponse<Skill[]>> {
  try {
    const response = await fetchWithAuth("/services/skills");
    if (!response.ok) return error("Không thể tải danh sách kỹ năng");

    const result = await response.json();
    return success(result);
  } catch (err) {
    return error("Lỗi kết nối máy chủ");
  }
}

/**
 * Tạo kỹ năng mới
 */
export async function createSkill(
  name: string,
  code: string,
  description?: string
): Promise<ActionResponse<Skill>> {
  try {
    const response = await fetchWithAuth("/services/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, code, description }),
    });

    if (!response.ok) return error("Không thể tạo kỹ năng");

    const result = await response.json();
    revalidatePath("/admin/services");
    return success(result, "Đã tạo kỹ năng");
  } catch (err) {
    return error("Lỗi kết nối máy chủ");
  }
}

/**
 * Cập nhật kỹ năng
 */
export async function updateSkill(
  id: string,
  data: { name?: string; code?: string; description?: string }
): Promise<ActionResponse<Skill>> {
  try {
    const response = await fetchWithAuth(`/services/skills/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) return error("Không thể cập nhật kỹ năng");

    const result = await response.json();
    revalidatePath("/admin/services");
    return success(result, "Đã cập nhật kỹ năng");
  } catch (err) {
    return error("Lỗi kết nối máy chủ");
  }
}

/**
 * Xóa kỹ năng
 */
export async function deleteSkill(id: string): Promise<ActionResponse<void>> {
  try {
    const response = await fetchWithAuth(`/services/skills/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) return error("Không thể xóa kỹ năng");

    revalidatePath("/admin/services");
    return success(undefined, "Đã xóa kỹ năng");
  } catch (err) {
    return error("Lỗi kết nối máy chủ");
  }
}
