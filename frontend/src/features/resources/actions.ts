"use server";

import { ActionResponse, error, success } from "@/shared/lib/action-response";
import { revalidateTag } from "next/cache";
import { resourceSchema } from "./schemas";

export async function manageResource(
  prevState: unknown,
  formData: FormData
): Promise<ActionResponse> {
  const id = formData.get("id") as string;
  const rawData = buildResourcePayload(formData);

  const validatedFields = resourceSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return error(
      "Dữ liệu không hợp lệ",
      validatedFields.error.flatten().fieldErrors
    );
  }

  try {
    if (id) {
      // In production, call resource update API
      revalidateTag("resources", "max");
      return success(undefined, "Cập nhật tài nguyên thành công");
    }

    // In production, call resource create API
    revalidateTag("resources", "max");
    return success(undefined, "Tạo tài nguyên mới thành công");
  } catch (_err) {
    return error("Đã có lỗi xảy ra");
  }
}

export async function deleteResource(id: string): Promise<ActionResponse> {
  revalidateTag("resources", "max");
  revalidateTag(`resource-${id}`, "max");
  return success(undefined, "Đã xóa tài nguyên thành công");
}

function buildResourcePayload(formData: FormData): Record<string, unknown> {
  const rawData: Record<string, unknown> = {};

  formData.forEach((value, key) => {
    if (key === "id" || key === "form_mode") return;
    if (key === "tags") {
      try {
        rawData[key] = JSON.parse(value as string);
      } catch {
        rawData[key] = [];
      }
      return;
    }

    rawData[key] = value;
  });

  return rawData;
}