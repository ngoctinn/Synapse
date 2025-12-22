"use server";

import "server-only";

import { ActionResponse, error, success } from "@/shared/lib/action-response";
import { revalidatePath } from "next/cache";
import { MOCK_WAITLIST } from "./data/mocks";
import { waitlistCreateSchema } from "./schemas";
import { PaginatedWaitlist, WaitlistCreateInput, WaitlistEntry } from "./types";
import { MOCK_SERVICES } from "@/features/services/data/mocks";

let waitlist = [...MOCK_WAITLIST];

export async function getWaitlist(
  page = 1,
  limit = 10,
  status?: string,
  search?: string
): Promise<ActionResponse<PaginatedWaitlist>> {
  let filtered = waitlist;
  if (status && status !== "all") {
    filtered = filtered.filter((w) => w.status === status);
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      (w) =>
        w.customer_name.toLowerCase().includes(q) ||
        w.phone_number.includes(q)
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

export async function createWaitlistEntry(data: WaitlistCreateInput): Promise<ActionResponse<WaitlistEntry>> {
  const validation = waitlistCreateSchema.safeParse(data);
  if (!validation.success) return error("Dữ liệu không hợp lệ", validation.error.flatten().fieldErrors);

  // Mock: check service exist
  const service = MOCK_SERVICES.find((s) => s.id === data.service_id);
  const serviceName = service ? service.name : "Dịch vụ đã xóa";

  // Normalize phone & check duplicate
  const normalizedPhone = data.phone_number.replace(/\D/g, "");
  const isDuplicate = waitlist.some(
    (w) => w.phone_number.replace(/\D/g, "") === normalizedPhone && w.status === "pending"
  );

  if (isDuplicate) {
    return error("Khách hàng với số điện thoại này đã có trong danh sách chờ");
  }

  const newEntry: WaitlistEntry = {
    id: `wl_new_${Date.now()}`,
    customer_id: data.customer_id || `guest_${Date.now()}`,
    customer_name: data.customer_name,
    phone_number: normalizedPhone,
    service_id: data.service_id,
    service_name: serviceName,
    preferred_date: data.preferred_date,
    preferred_time_slot: data.preferred_time_slot,
    notes: data.notes || null,
    status: "pending",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  waitlist = [newEntry, ...waitlist];
  revalidatePath("/admin/waitlist");
  return success(newEntry, "Đã thêm vào danh sách chờ");
}

export async function updateWaitlistStatus(
  id: string,
  status: WaitlistEntry["status"]
): Promise<ActionResponse<WaitlistEntry>> {
  const index = waitlist.findIndex((w) => w.id === id);
  if (index === -1) return error("Không tìm thấy yêu cầu");

  waitlist[index] = {
    ...waitlist[index],
    status,
    updated_at: new Date().toISOString(),
  };

  revalidatePath("/admin/waitlist");
  return success(waitlist[index], "Cập nhật trạng thái thành công");
}

export async function deleteWaitlistEntry(id: string): Promise<ActionResponse> {
  waitlist = waitlist.filter((w) => w.id !== id);
  revalidatePath("/admin/waitlist");
  return success(undefined, "Đã xóa khỏi danh sách chờ");
}
export async function updateWaitlistEntry(_data: WaitlistCreateInput): Promise<ActionResponse<WaitlistEntry>> {
  return error("Chức năng cập nhật chưa được triển khai");
}
