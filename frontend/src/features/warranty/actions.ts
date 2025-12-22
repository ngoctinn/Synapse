"use server";

import "server-only";

import { ActionResponse, error, success } from "@/shared/lib/action-response";
import { revalidatePath } from "next/cache";
import { MOCK_WARRANTIES } from "./data/mocks";
import { warrantyCreateSchema } from "./schemas";
import { PaginatedWarranties, WarrantyCreateInput, WarrantyTicket } from "./types";
import { MOCK_TREATMENTS } from "@/features/treatments/data/mocks"; // Để link với treatment

let warranties = [...MOCK_WARRANTIES];

export async function getWarranties(
  page = 1,
  limit = 10,
  status?: string
): Promise<ActionResponse<PaginatedWarranties>> {
  let filtered = warranties;
  if (status && status !== "all") {
    filtered = filtered.filter((w) => w.status === status);
  }

  const start = (page - 1) * limit;
  return success({
    data: filtered.slice(start, start + limit),
    total: filtered.length,
    page,
    limit,
  });
}

export async function createWarranty(data: WarrantyCreateInput): Promise<ActionResponse<WarrantyTicket>> {
  const validation = warrantyCreateSchema.safeParse(data);
  if (!validation.success) return error("Dữ liệu không hợp lệ", validation.error.flatten().fieldErrors);

  // Mock: fetch treatment details
  const treatment = MOCK_TREATMENTS.find((t) => t.id === data.treatment_id);
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
  return success(newTicket, "Tạo phiếu bảo hành thành công");
}

export async function updateWarrantyStatus(
  id: string,
  status: WarrantyTicket["status"]
): Promise<ActionResponse<WarrantyTicket>> {
  const index = warranties.findIndex((w) => w.id === id);
  if (index === -1) return error("Không tìm thấy phiếu bảo hành");

  warranties[index] = {
    ...warranties[index],
    status,
    updated_at: new Date().toISOString(),
  };

  revalidatePath("/admin/warranty");
  return success(warranties[index], "Cập nhật trạng thái thành công");
}
export async function updateWarranty(_data: WarrantyCreateInput): Promise<ActionResponse<WarrantyTicket>> {
  return error("Chức năng cập nhật chưa được triển khai");
}
