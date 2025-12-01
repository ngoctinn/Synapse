"use server";

import { fetchWithAuth } from "@/shared/lib/api";
import { revalidatePath } from "next/cache";
import { serviceSchema } from "./schemas";
import { PaginatedResponse, Service, ServiceCreateInput, ServiceUpdateInput, Skill } from "./types";

const SERVICE_TAG = "services";

export async function getServices(
  page = 1,
  limit = 10,
  search?: string,
  activeOnly = false
): Promise<PaginatedResponse<Service>> {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  if (search) {
    params.append("search", search);
  }
  if (activeOnly) {
    params.append("active", "true");
  }

  const queryString = params.toString() ? `?${params.toString()}` : "";

  const res = await fetchWithAuth(`/services${queryString}`, {
    method: "GET",
    next: { tags: [SERVICE_TAG] },
  });

  if (!res.ok) {
    throw new Error("Không thể tải danh sách dịch vụ");
  }

  return res.json();
}

export async function getService(id: string): Promise<Service> {
  const res = await fetchWithAuth(`/services/${id}`, {
    method: "GET",
    next: { tags: [SERVICE_TAG] },
  });

  if (!res.ok) {
    throw new Error("Không thể tải thông tin dịch vụ");
  }

  return res.json();
}

export async function createService(data: ServiceCreateInput): Promise<{ success: boolean; message?: string; data?: Service }> {
  // Validate dữ liệu đầu vào tại server
  const validation = serviceSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Dữ liệu không hợp lệ: " + validation.error.issues[0].message };
  }

  const res = await fetchWithAuth("/services", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    return { success: false, message: error.detail || "Không thể tạo dịch vụ" };
  }

  revalidatePath("/admin/services");
  return { success: true, data: await res.json() };
}

export async function cloneService(id: string): Promise<{ success: boolean; message?: string }> {
    try {
        // 1. Lấy thông tin dịch vụ hiện tại
        const service = await getService(id);

        // 2. Chuẩn bị dữ liệu nhân bản
        const cloneData: ServiceCreateInput = {
            name: `${service.name} (Sao chép)`,
            duration: service.duration,
            buffer_time: service.buffer_time,
            price: service.price,
            is_active: false, // Mặc định ẩn bản sao
            skill_ids: service.skills.map(s => s.id),
            new_skills: []
        };

        // 3. Tạo dịch vụ mới
        return await createService(cloneData);
    } catch (error) {
        console.error("Lỗi nhân bản dịch vụ:", error);
        return { success: false, message: "Không thể nhân bản dịch vụ" };
    }
}

export async function updateService(id: string, data: ServiceUpdateInput): Promise<{ success: boolean; message?: string; data?: Service }> {
  // Validate dữ liệu đầu vào (partial vì là update)
  // Lưu ý: ServiceUpdateInput có thể thiếu trường, nên dùng partial()
  const validation = serviceSchema.partial().safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Dữ liệu không hợp lệ: " + validation.error.issues[0].message };
  }

  const res = await fetchWithAuth(`/services/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    return { success: false, message: error.detail || "Không thể cập nhật dịch vụ" };
  }

  revalidatePath("/admin/services");
  return { success: true, data: await res.json() };
}

export async function deleteService(id: string): Promise<{ success: boolean; message?: string }> {
  const res = await fetchWithAuth(`/services/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.json();
    return { success: false, message: error.detail || "Không thể xóa dịch vụ" };
  }

  revalidatePath("/admin/services");
  return { success: true, message: "Đã xóa dịch vụ thành công" };
}

export async function getSkills(): Promise<Skill[]> {
    const res = await fetchWithAuth("/services/skills", {
        method: "GET",
        next: { tags: ["skills"] },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch skills");
    }

    return res.json();
}
