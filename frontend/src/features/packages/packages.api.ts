import "server-only";

import { ActionResponse, error, success } from "@/shared/lib/action-response";
import { fetchWithAuth } from "@/shared/lib/api";
import { cache } from "react";
import {
  PackageCreateInput,
  PackageUpdateInput,
  PaginatedPackages,
  ServicePackage,
} from "./model/types";

/**
 * Lấy danh sách gói dịch vụ
 */
export const getPackages = cache(async (
  page = 1,
  limit = 10,
  search?: string,
  status?: string // "active", "inactive", "all"
): Promise<ActionResponse<PaginatedPackages>> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) params.append("search", search);
    if (status && status !== "all") {
      params.append("active", (status === "active").toString());
    }

    const response = await fetchWithAuth(`/packages?${params.toString()}`, {
      next: { tags: ["packages"] },
    });
    if (!response.ok) return error("Không thể tải danh sách gói dịch vụ");

    const result = await response.json();
    return success(result);
  } catch (err) {
    console.error("getPackages error:", err);
    return error("Lỗi kết nối máy chủ");
  }
});

/**
 * Lấy thông tin chi tiết gói dịch vụ
 */
export const getPackage = cache(async (
  id: string
): Promise<ActionResponse<ServicePackage>> => {
  try {
    const response = await fetchWithAuth(`/packages/${id}`, {
      next: { tags: [`package-${id}`, "packages"] },
    });
    if (!response.ok) {
      if (response.status === 404) return error("Gói dịch vụ không tồn tại");
      return error("Không thể tải thông tin gói dịch vụ");
    }

    const result = await response.json();
    return success(result);
  } catch (_) {
    return error("Lỗi kết nối máy chủ");
  }
});

/**
 * Mutation APIs
 */

export async function createPackageApi(data: PackageCreateInput): Promise<ActionResponse<ServicePackage>> {
  try {
    const response = await fetchWithAuth("/packages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return error(errData.detail || "Không thể tạo gói dịch vụ");
    }

    return success(await response.json());
  } catch (_) {
    return error("Lỗi kết nối máy chủ");
  }
}

export async function updatePackageApi(id: string, data: Partial<PackageCreateInput>): Promise<ActionResponse<ServicePackage>> {
  try {
    const response = await fetchWithAuth(`/packages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return error(errData.detail || "Không thể cập nhật gói dịch vụ");
    }

    return success(await response.json());
  } catch (_) {
    return error("Lỗi kết nối máy chủ");
  }
}

export async function deletePackageApi(id: string): Promise<ActionResponse> {
  try {
    const response = await fetchWithAuth(`/packages/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) return error("Không thể xóa gói dịch vụ");

    return success(undefined);
  } catch (_) {
    return error("Lỗi kết nối máy chủ");
  }
}
