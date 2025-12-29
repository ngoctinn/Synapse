"use server";

import { ActionResponse, error } from "@/shared/lib/action-response";
import { revalidateTag } from "next/cache";
import { packageSchema } from "./model/schemas";
import {
  PackageCreateInput,
  PackageUpdateInput,
  ServicePackage,
} from "./model/types";
import {
  createPackageApi,
  deletePackageApi,
  updatePackageApi,
} from "./packages.api";

/**
 * Tạo gói dịch vụ mới
 */
export async function createPackage(
  data: PackageCreateInput
): Promise<ActionResponse<ServicePackage>> {
  const validation = packageSchema.safeParse(data);
  if (!validation.success)
    return error(
      "Dữ liệu không hợp lệ",
      validation.error.flatten().fieldErrors
    );

  const result = await createPackageApi(data);
  if (result.status === "success") {
    revalidateTag("packages", "max");
  }
  return result;
}

/**
 * Cập nhật gói dịch vụ
 */
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

  const result = await updatePackageApi(id, updateData);
  if (result.status === "success") {
    revalidateTag("packages", "max");
    revalidateTag(`package-${id}`, "max");
  }
  return result;
}

/**
 * Xóa gói dịch vụ
 */
export async function deletePackage(id: string): Promise<ActionResponse> {
  const result = await deletePackageApi(id);
  if (result.status === "success") {
    revalidateTag("packages", "max");
    revalidateTag(`package-${id}`, "max");
  }
  return result;
}

/**
 * Bật/Tắt trạng thái hoạt động
 */
export async function togglePackageStatus(
  id: string,
  currentStatus: boolean
): Promise<ActionResponse<ServicePackage>> {
  return updatePackage({ id, is_active: !currentStatus });
}
