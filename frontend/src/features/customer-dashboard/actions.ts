'use server'

import { revalidatePath } from "next/cache"
import { updateCustomerProfile } from "./services/api"

export async function updateProfile(prevState: any, formData: FormData) {
  const rawData: any = {
    fullName: formData.get('fullName') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
  }

  const avatarFile = formData.get('avatar') as File
  if (avatarFile && avatarFile.size > 0) {
    // Simulate upload - in real app, upload to storage and get URL
    console.log('Uploading avatar:', avatarFile.name)
    // For now, we'll just mock it by not changing the URL or setting a dummy one if needed
    // In a real scenario, we would set rawData.avatarUrl = uploadedUrl
  }

  try {
    await updateCustomerProfile(rawData)
    revalidatePath('/dashboard/profile')
    return { message: 'Cập nhật hồ sơ thành công!', success: true }
  } catch (e) {
    return { message: 'Đã có lỗi xảy ra', success: false }
  }
}
