"use server";

import { revalidatePath } from "next/cache";
import "server-only";
import { profileSchema } from "./schemas";
import { updateCustomerProfile } from "./services/api";

import { ActionState } from "./types";

export async function updateProfile(prevState: ActionState, formData: FormData): Promise<ActionState> {
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
    return { success: false, message: validatedFields.error.issues[0].message };
  }

  const avatarFile = formData.get("avatar") as File;
  if (avatarFile && avatarFile.size > 0) {
    // TODO: Implement real avatar upload
    // 1. Upload file to Supabase Storage
    // 2. Get public URL
    // 3. Update validatedFields.data.avatarUrl with the new URL
    console.log("TODO: Upload avatar:", avatarFile.name);
  }

  try {
    await updateCustomerProfile(validatedFields.data);
    revalidatePath("/dashboard/profile");
    return { message: "Cập nhật hồ sơ thành công!", success: true };
  } catch (e) {
    // console.error("Update Profile Error:", e); // Removed console.error as per clean code
    return { message: `Đã có lỗi xảy ra: ${e instanceof Error ? e.message : String(e)}`, success: false };
  }
}
