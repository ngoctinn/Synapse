"use server";

import "server-only";

import { ActionResponse, error, success } from "@/shared/lib/action-response";
import { revalidatePath } from "next/cache";
import { packageSchema } from "./model/schemas";
import {
  PackageCreateInput,
  PackageUpdateInput,
  PaginatedPackages,
  ServicePackage,
} from "./model/types";

import { fetchWithAuth } from "@/shared/lib/api";

export async function getPackages(
  page = 1,
  limit = 10,
  search?: string,
  status?: string // "active", "inactive", "all"
): Promise<ActionResponse<PaginatedPackages>> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) params.append("search", search);
    if (status && status !== "all") {
        params.append("active", (status === "active").toString());
    }

    const response = await fetchWithAuth(`/packages?${params.toString()}`);
    if (!response.ok) return error("Không thể tải danh sách gói dịch vụ");

    const result = await response.json();
    return success(result);
  } catch (err) {
    console.error("getPackages error:", err);
    return error("Lỗi kết nối máy chủ");
  }
}

export async function getPackage(
  id: string
): Promise<ActionResponse<ServicePackage>> {
  try {
    const response = await fetchWithAuth(`/packages/${id}`);
    if (!response.ok) {
       if (response.status === 404) return error("Gói dịch vụ không tồn tại");
       return error("Không thể tải thông tin gói dịch vụ");
    }

    const result = await response.json();
    return success(result);
  } catch (err) {
    return error("Lỗi kết nối máy chủ");
  }
}

export async function createPackage(
  data: PackageCreateInput
): Promise<ActionResponse<ServicePackage>> {
  const validation = packageSchema.safeParse(data);
  if (!validation.success)
    return error(
      "Dữ liệu không hợp lệ",
      validation.error.flatten().fieldErrors
    );

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

    const result = await response.json();
    revalidatePath("/admin/packages");
    return success(result, "Tạo gói dịch vụ thành công");
  } catch (err) {
    return error("Lỗi kết nối máy chủ");
  }
}

export async function updatePackage(
  data: PackageUpdateInput
): Promise<ActionResponse<ServicePackage>> {
  const { id, ...updateData } = data;
  const validation = packageSchema.partial().safeParse(updateData);
  if (!validation.success)
    return error(
      "Dữ liệu không hợp lệ",
      validation.error.flatten().fieldErrors
    );

  try {
    const response = await fetchWithAuth(`/packages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return error(errData.detail || "Không thể cập nhật gói dịch vụ");
    }

    const result = await response.json();
    revalidatePath("/admin/packages");
    return success(result, "Cập nhật gói dịch vụ thành công");
  } catch (err) {
    return error("Lỗi kết nối máy chủ");
  }
}

export async function deletePackage(id: string): Promise<ActionResponse> {
  try {
    const response = await fetchWithAuth(`/packages/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) return error("Không thể xóa gói dịch vụ");

    revalidatePath("/admin/packages");
    return success(undefined, "Đã xóa gói dịch vụ thành công");
  } catch (err) {
    return error("Lỗi kết nối máy chủ");
  }
}

export async function togglePackageStatus(
  id: string,
  currentStatus: boolean
): Promise<ActionResponse<ServicePackage>> {
  return updatePackage({ id, is_active: !currentStatus });
}

