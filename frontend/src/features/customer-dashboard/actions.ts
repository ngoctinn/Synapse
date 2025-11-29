"use server";

import { revalidatePath } from "next/cache";
import "server-only";
import { profileSchema } from "./schemas";
import { updateCustomerProfile } from "./services/api";

export async function updateProfile(prevState: any, formData: FormData) {
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
    // Simulate upload - in real app, upload to storage and get URL
    console.log("Uploading avatar:", avatarFile.name);
    // For now, we'll just mock it by not changing the URL or setting a dummy one if needed
    // In a real scenario, we would set rawData.avatarUrl = uploadedUrl
  }

  try {
    await updateCustomerProfile(validatedFields.data);
    revalidatePath("/dashboard/profile");
    return { message: "Cập nhật hồ sơ thành công!", success: true };
  } catch (e) {
    console.error("Update Profile Error:", e);
    return { message: `Đã có lỗi xảy ra: ${e instanceof Error ? e.message : String(e)}`, success: false };
  }
}
