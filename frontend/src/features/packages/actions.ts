"use server";

import "server-only";

import { ActionResponse, error, success } from "@/shared/lib/action-response";
import { revalidatePath } from "next/cache";
import { MOCK_PACKAGES } from "./data/mocks";
import { packageSchema } from "./schemas";
import { PaginatedPackages, PackageCreateInput, PackageUpdateInput, ServicePackage } from "./types";

let packages = [...MOCK_PACKAGES];

export async function getPackages(
  page = 1,
  limit = 10,
  activeOnly = false
): Promise<ActionResponse<PaginatedPackages>> {
  let filtered = packages;
  if (activeOnly) filtered = filtered.filter((p) => p.is_active);

  const start = (page - 1) * limit;
  return success({
    data: filtered.slice(start, start + limit),
    total: filtered.length,
    page,
    limit,
  });
}

export async function getPackage(id: string): Promise<ActionResponse<ServicePackage>> {
  const pkg = packages.find((p) => p.id === id);
  return pkg ? success(pkg) : error("Không tìm thấy gói dịch vụ");
}

export async function createPackage(data: PackageCreateInput): Promise<ActionResponse<ServicePackage>> {
  const validation = packageSchema.safeParse(data);
  if (!validation.success) return error("Dữ liệu không hợp lệ", validation.error.flatten().fieldErrors);

  const newPackage: ServicePackage = {
    id: `pkg_new_${Date.now()}`,
    name: data.name,
    description: data.description || null,
    price: data.price,
    validity_days: data.validity_days,
    is_active: data.is_active ?? true,
    services: data.services.map((s) => ({
      service_id: s.service_id,
      service_name: `Dịch vụ ${s.service_id}`, // Placeholder - would fetch from services
      quantity: s.quantity,
    })),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  packages = [newPackage, ...packages];
  revalidatePath("/admin/packages");
  return success(newPackage, "Tạo gói dịch vụ thành công");
}

export async function updatePackage(data: PackageUpdateInput): Promise<ActionResponse<ServicePackage>> {
  const { id, ...updateData } = data;
  const validation = packageSchema.partial().safeParse(updateData);
  if (!validation.success) return error("Dữ liệu không hợp lệ", validation.error.flatten().fieldErrors);

  const index = packages.findIndex((p) => p.id === id);
  if (index === -1) return error("Không tìm thấy gói dịch vụ");

  const updatedPackage: ServicePackage = {
    ...packages[index],
    ...updateData,
    services: updateData.services
      ? updateData.services.map((s) => ({
          service_id: s.service_id,
          service_name: `Dịch vụ ${s.service_id}`,
          quantity: s.quantity,
        }))
      : packages[index].services,
    updated_at: new Date().toISOString(),
  };

  packages[index] = updatedPackage;
  revalidatePath("/admin/packages");
  return success(updatedPackage, "Cập nhật gói dịch vụ thành công");
}

export async function deletePackage(id: string): Promise<ActionResponse> {
  packages = packages.filter((p) => p.id !== id);
  revalidatePath("/admin/packages");
  return success(undefined, "Đã xóa gói dịch vụ thành công");
}

export async function togglePackageStatus(id: string): Promise<ActionResponse<ServicePackage>> {
  const index = packages.findIndex((p) => p.id === id);
  if (index === -1) return error("Không tìm thấy gói dịch vụ");

  packages[index] = {
    ...packages[index],
    is_active: !packages[index].is_active,
    updated_at: new Date().toISOString(),
  };

  revalidatePath("/admin/packages");
  return success(packages[index], packages[index].is_active ? "Đã kích hoạt gói" : "Đã tạm ngưng gói");
}
