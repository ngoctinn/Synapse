"use server";

import { ActionResponse, error, success } from "@/shared/lib/action-response";
import { fetchWithAuth } from "@/shared/lib/api";
import { revalidatePath } from "next/cache";
import "server-only";
import { profileSchema } from "./model/schemas";
import { MOCK_APPOINTMENTS, MOCK_TREATMENTS } from "./model/mocks";
import { cancelAppointment as adminCancelAppointment } from "@/features/appointments/actions";
import type { UserProfile } from "./model/types";

// === API Response Types (Backend snake_case) ===
interface BackendUserResponse {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  address: string | null;
  date_of_birth: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

// === Mappers: Backend -> Frontend ===
function mapBackendUserToFrontend(data: BackendUserResponse): UserProfile {
  return {
    id: data.id,
    email: data.email,
    fullName: data.full_name || "Người dùng",
    phone_number: data.phone_number,
    avatarUrl: data.avatar_url || undefined,
    address: data.address || undefined,
    dateOfBirth: data.date_of_birth || undefined,
    membershipTier: undefined, // TODO: Get from customers table
    loyaltyPoints: undefined, // TODO: Get from customers table
  };
}

// === Server-only API functions ===

export async function getCustomerProfile(): Promise<UserProfile> {
  try {
    const res = await fetchWithAuth("/users/me");
    if (!res.ok) {
      console.error("Failed to fetch profile:", res.status);
      throw new Error("Không thể tải hồ sơ");
    }
    const data: BackendUserResponse = await res.json();
    return mapBackendUserToFrontend(data);
  } catch (e) {
    console.error("getCustomerProfile error:", e);
    throw e;
  }
}

export async function getCustomerAppointments() {
  // TODO: Kết nối với API /bookings khi backend sẵn sàng
  await new Promise((r) => setTimeout(r, 200));
  return MOCK_APPOINTMENTS;
}

export async function getCustomerTreatments() {
  // TODO: Kết nối với API /treatments khi backend sẵn sàng
  await new Promise((r) => setTimeout(r, 200));
  return MOCK_TREATMENTS;
}

export async function cancelBooking(
  id: string,
  reason: string
): Promise<ActionResponse<unknown>> {
  const result = await adminCancelAppointment(id, reason);
  revalidatePath("/dashboard/appointments");
  return result;
}

export async function updateProfile(
  prevState: unknown,
  formData: FormData
): Promise<ActionResponse> {
  const rawData = {
    fullName: formData.get("fullName"),
    phone_number: formData.get("phone_number")?.toString() || undefined,
    email: formData.get("email")?.toString() || undefined,
    address: formData.get("address")?.toString() || undefined,
    dateOfBirth: formData.get("dateOfBirth")?.toString() || undefined,
    avatarUrl: formData.get("avatarUrl")?.toString() || undefined,
  };

  const validatedFields = profileSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return error(
      "Dữ liệu không hợp lệ",
      validatedFields.error.flatten().fieldErrors
    );
  }

  // Map Frontend fields -> Backend snake_case
  const backendPayload: Record<string, unknown> = {};

  if (validatedFields.data.fullName) {
    backendPayload.full_name = validatedFields.data.fullName;
  }
  if (validatedFields.data.phone_number) {
    backendPayload.phone_number = validatedFields.data.phone_number;
  }
  if (validatedFields.data.address) {
    backendPayload.address = validatedFields.data.address;
  }
  if (validatedFields.data.dateOfBirth) {
    backendPayload.date_of_birth = validatedFields.data.dateOfBirth;
  }
  if (validatedFields.data.avatarUrl) {
    backendPayload.avatar_url = validatedFields.data.avatarUrl;
  }

  try {
    const res = await fetchWithAuth("/users/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(backendPayload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return error(errorData.detail || "Cập nhật thất bại");
    }

    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard");
    return success(undefined, "Cập nhật hồ sơ thành công!");
  } catch (e) {
    return error(
      `Đã có lỗi xảy ra: ${e instanceof Error ? e.message : String(e)}`
    );
  }
}
