"use server";

import "server-only";

import { ActionResponse, error, success } from "@/shared/lib/action-response";
import { revalidatePath } from "next/cache";
import { MOCK_TREATMENTS } from "./data/mocks";
import { treatmentCreateSchema } from "./schemas";
import { CustomerTreatment, PaginatedTreatments, TreatmentCreateInput } from "./types";
import { MOCK_PACKAGES } from "../packages/data/mocks";

let treatments = [...MOCK_TREATMENTS];

export async function getTreatments(
  page = 1,
  limit = 10,
  status?: string,
  search?: string
): Promise<ActionResponse<PaginatedTreatments>> {
  let filtered = treatments;
  if (status && status !== "all") {
    filtered = filtered.filter((t) => t.status === status);
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.customer_name.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q)
    );
  }

  const start = (page - 1) * limit;
  return success({
    data: filtered.slice(start, start + limit),
    total: filtered.length,
    page,
    limit,
  });
}

export async function getTreatment(id: string): Promise<ActionResponse<CustomerTreatment>> {
  const tmt = treatments.find((t) => t.id === id);
  return tmt ? success(tmt) : error("Không tìm thấy liệu trình");
}

export async function createTreatment(data: TreatmentCreateInput): Promise<ActionResponse<CustomerTreatment>> {
  const validation = treatmentCreateSchema.safeParse(data);
  if (!validation.success) return error("Dữ liệu không hợp lệ", validation.error.flatten().fieldErrors);

  // Mock logic: Get package details to calculate totals
  const pkg = MOCK_PACKAGES.find(p => p.id === data.package_id);
  if (!pkg) return error("Gói dịch vụ không tồn tại");

  const totalSessions = pkg.services.reduce((acc, curr) => acc + curr.quantity, 0);
  const expiryDate = new Date(data.start_date);
  expiryDate.setDate(expiryDate.getDate() + pkg.validity_days);

  const newTreatment: CustomerTreatment = {
    id: `tmt_new_${Date.now()}`,
    customer_id: data.customer_id,
    customer_name: "Khách hàng Mới", // Placeholder, in real app fetch customer
    package_id: data.package_id,
    package_name: pkg.name,
    total_sessions: totalSessions,
    sessions_completed: 0,
    start_date: data.start_date,
    end_date: null,
    expiry_date: expiryDate.toISOString(),
    status: "active",
    notes: data.notes || null,
    progress: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  treatments = [newTreatment, ...treatments];
  revalidatePath("/admin/treatments");
  return success(newTreatment, "Đăng ký liệu trình thành công");
}

export async function checkInSession(treatmentId: string): Promise<ActionResponse> {
  const index = treatments.findIndex((t) => t.id === treatmentId);
  if (index === -1) return error("Không tìm thấy liệu trình");

  const treatment = treatments[index];
  if (treatment.status !== "active") return error("Liệu trình không khả dụng hoặc đã hoàn thành");

  if (treatment.sessions_completed >= treatment.total_sessions) {
    return error("Liệu trình đã hoàn thành tất cả các buổi");
  }

  const newCompleted = treatment.sessions_completed + 1;
  const isCompleted = newCompleted >= treatment.total_sessions;

  treatments[index] = {
    ...treatment,
    sessions_completed: newCompleted,
    progress: (newCompleted / treatment.total_sessions) * 100,
    status: isCompleted ? "completed" : "active",
    end_date: isCompleted ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  revalidatePath("/admin/treatments");
  return success(undefined, "Đã check-in buổi liệu trình thành công");
}
