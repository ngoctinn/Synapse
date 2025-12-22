"use server";

import "server-only";

import { executeAction } from "@/shared/lib/execute-action";
import { revalidatePath } from "next/cache";
import { MOCK_WARRANTIES } from "./model/mocks";
import { warrantyCreateSchema } from "./model/schemas";
import type { PaginatedWarranties, WarrantyCreateInput, WarrantyTicket } from "./model/types";
import { MOCK_TREATMENTS } from "@/features/treatments/model/mocks";

let warranties = [...MOCK_WARRANTIES];

export async function getWarranties(
  page = 1,
  limit = 10,
  status?: string,
  search?: string
) {
  return executeAction("getWarranties", async () => {
    let filtered = warranties;
    if (status && status !== "all") {
      filtered = filtered.filter((w) => w.status === status);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (w) =>
          w.code.toLowerCase().includes(q) ||
          w.customer_name.toLowerCase().includes(q)
      );
    }

    const start = (page - 1) * limit;
    return {
      data: filtered.slice(start, start + limit),
      total: filtered.length,
      page,
      limit,
    } as PaginatedWarranties;
  }, "Không thể tải danh sách bảo hành");
}

export async function createWarranty(data: WarrantyCreateInput) {
  return executeAction("createWarranty", async () => {
    const validation = warrantyCreateSchema.safeParse(data);
    if (!validation.success) throw new Error("VALIDATION_FAILED");

    const treatment = MOCK_TREATMENTS.find((t) => t.id === data.treatment_id);
    if (!treatment) throw new Error("TREATMENT_NOT_FOUND");

    if (treatment.status === "cancelled") {
      throw new Error("TREATMENT_CANCELLED");
    }

    if (data.duration_months <= 0) {
      throw new Error("INVALID_DURATION");
    }

    const serviceName = treatment ? treatment.package_name : "Dịch vụ/Liệu trình không xác định";
    const customerName = treatment ? treatment.customer_name : "Khách hàng";

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + data.duration_months);

    const newTicket: WarrantyTicket = {
      id: `warr_new_${Date.now()}`,
      code: `WB-${new Date().getFullYear()}${Math.floor(Math.random() * 10000)}`,
      customer_id: data.customer_id,
      customer_name: customerName,
      treatment_id: data.treatment_id,
      service_name: serviceName,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      terms: data.terms,
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    warranties = [newTicket, ...warranties];
    revalidatePath("/admin/warranty");
    return newTicket;
  }, "Lỗi khi tạo phiếu bảo hành");
}

export async function updateWarrantyStatus(
  id: string,
  status: WarrantyTicket["status"]
) {
  return executeAction("updateWarrantyStatus", async () => {
    const index = warranties.findIndex((w) => w.id === id);
    if (index === -1) throw new Error("NOT_FOUND");

    warranties[index] = {
      ...warranties[index],
      status,
      updated_at: new Date().toISOString(),
    };

    revalidatePath("/admin/warranty");
    return warranties[index];
  }, "Lỗi khi cập nhật trạng thái");
}

export async function updateWarranty(_data: WarrantyCreateInput) {
  return executeAction("updateWarranty", async () => {
    throw new Error("NOT_IMPLEMENTED");
  }, "Chức năng cập nhật chưa được triển khai");
}
