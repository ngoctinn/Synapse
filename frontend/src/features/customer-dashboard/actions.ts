'use server'

import { revalidatePath } from "next/cache"
import { updateCustomerProfile } from "./services/api"

export async function updateProfile(prevState: any, formData: FormData) {
  const rawData = {
    fullName: formData.get('fullName') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
  }

  try {
    await updateCustomerProfile(rawData)
    revalidatePath('/dashboard/profile')
    return { message: 'Cập nhật hồ sơ thành công!', success: true }
  } catch (e) {
    return { message: 'Đã có lỗi xảy ra', success: false }
  }
}
