"use server";

import { ActionResponse, error, success } from "@/shared/lib/action-response";
import { revalidatePath } from "next/cache";
import "server-only";
import { profileSchema } from "./schemas";
import { updateCustomerProfile } from "./services/api";
import { cancelAppointment as adminCancelAppointment } from "@/features/appointments/actions";

export async function cancelBooking(id: string, reason: string): Promise<ActionResponse<unknown>> {
  const result = await adminCancelAppointment(id, reason);
  revalidatePath("/dashboard/appointments");
  return result;
}


export async function updateProfile(prevState: unknown, formData: FormData): Promise<ActionResponse> {
  const rawData = {
    fullName: formData.get("fullName"),
    phone: formData.get("phone")?.toString() || undefined,
    email: formData.get("email")?.toString() || undefined,
    address: formData.get("address")?.toString() || undefined,
    dateOfBirth: formData.get("dateOfBirth")?.toString() || undefined,
    avatarUrl: formData.get("avatarUrl")?.toString() || undefined,
  };

  const validatedFields = profileSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return error("Dữ liệu không hợp lệ", validatedFields.error.flatten().fieldErrors);
  }

  const avatarFile = formData.get("avatar") as File;
  if (avatarFile && avatarFile.size > 0) {
    // TODO: Triển khai upload avatar thực tế
    // 1. Upload file lên Supabase Storage
    // 2. Lấy public URL
    // 3. Cập nhật validatedFields.data.avatarUrl với URL mới
  }

  try {
    await updateCustomerProfile(validatedFields.data);
    revalidatePath("/dashboard/profile");
    return success(undefined, "Cập nhật hồ sơ thành công!");
  } catch (e) {
    return error(`Đã có lỗi xảy ra: ${e instanceof Error ? e.message : String(e)}`);
  }
}
