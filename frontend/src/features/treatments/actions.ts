"use server";

import "server-only";

import { executeAction } from "@/shared/lib/execute-action";
import { revalidatePath } from "next/cache";
import { MOCK_TREATMENTS } from "./model/mocks";
import { treatmentCreateSchema } from "./model/schemas";
import type { CustomerTreatment, PaginatedTreatments, TreatmentCreateInput } from "./model/types";
import type { PackageService } from "../packages/model/types";
import { MOCK_PACKAGES } from "../packages/model/mocks";

let treatments = [...MOCK_TREATMENTS];

export async function getTreatments(
  page = 1,
  limit = 10,
  status?: string,
  search?: string
) {
  return executeAction("getTreatments", async () => {
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
    return {
      data: filtered.slice(start, start + limit),
      total: filtered.length,
      page,
      limit,
    } as PaginatedTreatments;
  }, "Không thể tải danh sách liệu trình");
}

export async function getTreatment(id: string) {
  return executeAction("getTreatment", async () => {
    const tmt = treatments.find((t) => t.id === id);
    if (!tmt) throw new Error("NOT_FOUND");
    return tmt;
  }, "Không tìm thấy liệu trình");
}

export async function createTreatment(data: TreatmentCreateInput) {
  return executeAction("createTreatment", async () => {
    const validation = treatmentCreateSchema.safeParse(data);
    if (!validation.success) throw new Error("VALIDATION_FAILED");

    const pkg = MOCK_PACKAGES.find(p => p.id === data.package_id);
    if (!pkg) throw new Error("PACKAGE_NOT_FOUND");

    const totalSessions = pkg.services.reduce((acc: number, curr: PackageService) => acc + curr.quantity, 0);
    const expiryDate = new Date(data.start_date);
    expiryDate.setDate(expiryDate.getDate() + pkg.validity_days);

    const newTreatment: CustomerTreatment = {
      id: `tmt_new_${Date.now()}`,
      customer_id: data.customer_id,
      customer_name: "Khách hàng Mới",
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
    return newTreatment;
  }, "Lỗi khi tạo liệu trình");
}

export async function checkInSession(treatmentId: string) {
  return executeAction("checkInSession", async () => {
    const index = treatments.findIndex((t) => t.id === treatmentId);
    if (index === -1) throw new Error("NOT_FOUND");

    const treatment = treatments[index];
    if (treatment.status !== "active") throw new Error("INVALID_STATUS");
    if (treatment.sessions_completed >= treatment.total_sessions) {
      throw new Error("SESSIONS_COMPLETED");
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
    return undefined;
  }, "Lỗi khi check-in liệu trình");
}
