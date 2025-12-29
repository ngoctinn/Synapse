import "server-only";

import { ActionResponse, error, success } from "@/shared/lib/action-response";
import { fetchWithAuth } from "@/shared/lib/api";
import { cache } from "react";
import {
  Service,
  ServiceCategory,
  ServiceCreateInput,
  ServicePagination,
  Skill,
} from "./model/types";

/**
 * Lấy danh sách dịch vụ (phân trang, tìm kiếm)
 */
export const getServices = cache(async (
  page = 1,
  limit = 10,
  search?: string,
  activeOnly = false
): Promise<ActionResponse<ServicePagination>> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      active: activeOnly.toString(),
    });
    if (search) params.append("search", search);

    const response = await fetchWithAuth(`/services?${params.toString()}`, {
      next: { tags: ["services"] },
    });
    if (!response.ok) return error("Không thể tải danh sách dịch vụ");

    const result = await response.json();
    return success(result);
  } catch (err) {
    console.error("getServices error:", err);
    return error("Lỗi kết nối máy chủ");
  }
});

/**
 * Lấy chi tiết dịch vụ
 */
export const getService = cache(async (id: string): Promise<ActionResponse<Service>> => {
  try {
    const response = await fetchWithAuth(`/services/${id}`, {
      next: { tags: [`service-${id}`, "services"] },
    });
    if (!response.ok) {
      if (response.status === 404) return error("Dịch vụ không tồn tại");
      return error("Không thể tải thông tin dịch vụ");
    }

    const result = await response.json();
    return success(result);
  } catch (_) {
    return error("Lỗi kết nối máy chủ");
  }
});

/**
 * Lấy danh sách danh mục
 */
export const getServiceCategories = cache(async (): Promise<
  ActionResponse<ServiceCategory[]>
> => {
  try {
    const response = await fetchWithAuth("/services/categories", {
      next: { tags: ["service-categories"] },
    });
    if (!response.ok) return error("Không thể tải danh sách danh mục");

    const result = await response.json();
    return success(result);
  } catch (_) {
    return error("Lỗi kết nối máy chủ");
  }
});

/**
 * Lấy danh sách kỹ năng
 */
export const getSkills = cache(async (): Promise<ActionResponse<Skill[]>> => {
  try {
    const response = await fetchWithAuth("/services/skills", {
      next: { tags: ["skills"] },
    });
    const result = await response.json();
    return success(result);
  } catch (_) {
    return error("Lỗi kết nối máy chủ");
  }
});

/**
 * Tạo dịch vụ mới
 */
export async function createServiceApi(
  data: ServiceCreateInput
): Promise<ActionResponse<Service>> {
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

    return success(await response.json());
  } catch (_) {
    return error("Lỗi kết nối máy chủ");
  }
}

/**
 * Cập nhật dịch vụ
 */
export async function updateServiceApi(
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

    return success(await response.json());
  } catch (_) {
    return error("Lỗi kết nối máy chủ");
  }
}

/**
 * Xóa dịch vụ
 */
export async function deleteServiceApi(id: string): Promise<ActionResponse<void>> {
  try {
    const response = await fetchWithAuth(`/services/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) return error("Không thể xóa dịch vụ");

    return success(undefined);
  } catch (_) {
    return error("Lỗi kết nối máy chủ");
  }
}

/**
 * Tạo danh mục mới
 */
export async function createServiceCategoryApi(
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

    return success(await response.json());
  } catch (_) {
    return error("Lỗi kết nối máy chủ");
  }
}

/**
 * Cập nhật danh mục
 */
export async function updateServiceCategoryApi(
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

    return success(await response.json());
  } catch (_) {
    return error("Lỗi kết nối máy chủ");
  }
}

/**
 * Xóa danh mục
 */
export async function deleteServiceCategoryApi(
  id: string
): Promise<ActionResponse<void>> {
  try {
    const response = await fetchWithAuth(`/services/categories/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) return error("Không thể xóa danh mục");

    return success(undefined);
  } catch (_) {
    return error("Lỗi kết nối máy chủ");
  }
}

/**
 * Tạo kỹ năng mới
 */
export async function createSkillApi(
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

    return success(await response.json());
  } catch (_) {
    return error("Lỗi kết nối máy chủ");
  }
}

/**
 * Cập nhật kỹ năng
 */
export async function updateSkillApi(
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

    return success(await response.json());
  } catch (_) {
    return error("Lỗi kết nối máy chủ");
  }
}

/**
 * Xóa kỹ năng
 */
export async function deleteSkillApi(id: string): Promise<ActionResponse<void>> {
  try {
    const response = await fetchWithAuth(`/services/skills/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) return error("Không thể xóa kỹ năng");

    return success(undefined);
  } catch (_) {
    return error("Lỗi kết nối máy chủ");
  }
}

// ... more mutations for categories and skills can be added similarly if needed, 
// but let's start with core services.


