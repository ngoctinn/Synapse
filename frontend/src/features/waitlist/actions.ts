"use server";

import "server-only";

import { executeAction } from "@/shared/lib/execute-action";
import { revalidatePath } from "next/cache";
import { MOCK_WAITLIST } from "./model/mocks";
import { waitlistCreateSchema } from "./model/schemas";
import type {
  PaginatedWaitlist,
  WaitlistCreateInput,
  WaitlistEntry,
} from "./model/types";
import { MOCK_SERVICES } from "@/features/services/model/mocks";

let waitlist = [...MOCK_WAITLIST];

export async function getWaitlist(
  page = 1,
  limit = 10,
  status?: string,
  search?: string
) {
  return executeAction(
    "getWaitlist",
    async () => {
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
      return {
        data: filtered.slice(start, start + limit),
        total: filtered.length,
        page,
        limit,
      } as PaginatedWaitlist;
    },
    "Không thể tải danh sách chờ"
  );
}

export async function createWaitlistEntry(data: WaitlistCreateInput) {
  return executeAction(
    "createWaitlistEntry",
    async () => {
      const validation = waitlistCreateSchema.safeParse(data);
      if (!validation.success) throw new Error("VALIDATION_FAILED");

      const service = MOCK_SERVICES.find((s) => s.id === data.service_id);
      const serviceName = service ? service.name : "Dịch vụ đã xóa";

      const normalizedPhone = data.phone_number.replace(/\D/g, "");
      const isDuplicate = waitlist.some(
        (w) =>
          w.phone_number.replace(/\D/g, "") === normalizedPhone &&
          w.status === "pending"
      );

      if (isDuplicate) throw new Error("DUPLICATE_PHONE");

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
      return newEntry;
    },
    "Lỗi khi thêm vào danh sách chờ"
  );
}

export async function updateWaitlistStatus(
  id: string,
  status: WaitlistEntry["status"]
) {
  return executeAction(
    "updateWaitlistStatus",
    async () => {
      const index = waitlist.findIndex((w) => w.id === id);
      if (index === -1) throw new Error("NOT_FOUND");

      waitlist[index] = {
        ...waitlist[index],
        status,
        updated_at: new Date().toISOString(),
      };

      revalidatePath("/admin/waitlist");
      return waitlist[index];
    },
    "Lỗi khi cập nhật trạng thái"
  );
}

export async function deleteWaitlistEntry(id: string) {
  return executeAction(
    "deleteWaitlistEntry",
    async () => {
      waitlist = waitlist.filter((w) => w.id !== id);
      revalidatePath("/admin/waitlist");
      return undefined;
    },
    "Lỗi khi xóa khỏi danh sách chờ"
  );
}

export async function updateWaitlistEntry(_data: WaitlistCreateInput) {
  return executeAction(
    "updateWaitlistEntry",
    async () => {
      throw new Error("NOT_IMPLEMENTED");
    },
    "Chức năng cập nhật chưa được triển khai"
  );
}
