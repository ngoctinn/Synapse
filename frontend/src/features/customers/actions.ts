"use server"

import { revalidatePath } from "next/cache"
import { MOCK_CUSTOMERS } from "./model/mocks"
import { customerSchema, customerUpdateSchema } from "./model/schemas"
import { Customer } from "./model/types"

export type ActionState = {
  success?: boolean
  error?: string
  message?: string
}

export type CustomerListResponse = {
    data: Customer[]
    total: number
    page: number
    limit: number
}

export async function getCustomers(
  page: number = 1,
  limit: number = 10
): Promise<CustomerListResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    data: MOCK_CUSTOMERS,
    total: MOCK_CUSTOMERS.length,
    page,
    limit,
  }
}

export async function manageCustomer(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const mode = formData.get("form_mode")
    if (mode === "create") {
        return createCustomer(prevState, formData)
    } else {
        return updateCustomer(prevState, formData)
    }
}

async function createCustomer(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const rawData = Object.fromEntries(formData.entries())
    const validated = customerSchema.safeParse(rawData)

    if (!validated.success) {
        return {
            success: false,
            error: validated.error.issues[0].message
        }
    }

    await new Promise((resolve) => setTimeout(resolve, 800))
    revalidatePath("/admin/customers")
    return { success: true, message: "Thêm khách hàng thành công (Mock)" }
}

async function updateCustomer(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const rawData = Object.fromEntries(formData.entries())
    const validated = customerUpdateSchema.safeParse(rawData)

     if (!validated.success) {
        return {
            success: false,
            error: validated.error.issues[0].message
        }
    }

    await new Promise((resolve) => setTimeout(resolve, 800))
    revalidatePath("/admin/customers")
    return { success: true, message: "Cập nhật khách hàng thành công (Mock)" }
}

export async function deleteCustomer(id: string): Promise<ActionState> {
    await new Promise((resolve) => setTimeout(resolve, 600))
    revalidatePath("/admin/customers")
    return { success: true, message: `Đã xóa khách hàng ${id} (Mock)` }
}
