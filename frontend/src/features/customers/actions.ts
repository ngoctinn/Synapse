"use server";

import { ActionResponse, error, success } from "@/shared/lib/action-response";
import { revalidatePath } from "next/cache";
import { MOCK_CUSTOMERS } from "./model/mocks";
import { customerSchema, customerUpdateSchema } from "./model/schemas";
import { Customer } from "./model/types";

export type CustomerListResponse = {
  data: Customer[];
  total: number;
  page: number;
  limit: number;
};

export async function getCustomers(
  page: number = 1,
  limit: number = 10
): Promise<ActionResponse<CustomerListResponse>> {
  return success({
    data: MOCK_CUSTOMERS,
    total: MOCK_CUSTOMERS.length,
    page,
    limit,
  });
}

export async function manageCustomer(
  prevState: unknown,
  formData: FormData
): Promise<ActionResponse> {
  const mode = formData.get("form_mode");
  return mode === "create"
    ? createCustomer(prevState, formData)
    : updateCustomer(prevState, formData);
}

async function createCustomer(
  prevState: unknown,
  formData: FormData
): Promise<ActionResponse> {
  const rawData = Object.fromEntries(formData.entries());
  const validated = customerSchema.safeParse(rawData);

  if (!validated.success) {
    return error("Dữ liệu không hợp lệ", validated.error.flatten().fieldErrors);
  }

  revalidatePath("/admin/customers");
  return success(undefined, "Thêm khách hàng thành công");
}

async function updateCustomer(
  prevState: unknown,
  formData: FormData
): Promise<ActionResponse> {
  const rawData = Object.fromEntries(formData.entries());
  const validated = customerUpdateSchema.safeParse(rawData);

  if (!validated.success) {
    return error("Dữ liệu không hợp lệ", validated.error.flatten().fieldErrors);
  }

  revalidatePath("/admin/customers");
  return success(undefined, "Cập nhật khách hàng thành công");
}

export async function deleteCustomer(id: string): Promise<ActionResponse> {
  revalidatePath("/admin/customers");
  return success(undefined, `Đã xóa khách hàng ${id} thành công`);
}
