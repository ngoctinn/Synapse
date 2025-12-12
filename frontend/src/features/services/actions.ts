"use server";

import "server-only";

import { ActionResponse, error, success } from "@/shared/lib/action-response";
import { revalidatePath } from "next/cache";
import { MOCK_SERVICES, MOCK_SKILLS } from "./data/mocks";
import { serviceSchema, skillSchema } from "./schemas";
import { PaginatedResponse, Service, ServiceCreateInput, ServiceUpdateInput, Skill, SkillCreateInput, SkillUpdateInput } from "./types";

// In-memory store for development (will reset on server restart)
let services = [...MOCK_SERVICES];
let skills = [...MOCK_SKILLS];

export async function getServices(
  page = 1,
  limit = 10,
  search?: string,
  activeOnly = false
): Promise<ActionResponse<PaginatedResponse<Service>>> {

  await new Promise((resolve) => setTimeout(resolve, 500));

  let filtered = services;

  if (activeOnly) {
    filtered = filtered.filter((s) => s.is_active);
  }

  if (search) {
    const lowerSearch = search.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.name.toLowerCase().includes(lowerSearch) ||
        (s.description || "").toLowerCase().includes(lowerSearch)
    );
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const data = filtered.slice(start, end);

  return success({
    data: data,
    total,
    page,
    limit,
  });
}

export async function getService(id: string): Promise<ActionResponse<Service>> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const service = services.find((s) => s.id === id);
  if (!service) {
    return error("Không tìm thấy dịch vụ");
  }
  return success(service);
}

export async function createService(data: ServiceCreateInput): Promise<ActionResponse<Service>> {
  const validation = serviceSchema.safeParse(data);
  if (!validation.success) {
    return error("Dữ liệu không hợp lệ", validation.error.flatten().fieldErrors);
  }

  await new Promise((resolve) => setTimeout(resolve, 800));

  const newService: Service = {
    id: `svc_new_${Date.now()}`,
    ...data,
    buffer_time: data.buffer_time || 15,
    price: data.price || 0,
    color: data.color || "#3b82f6",
    is_active: data.is_active ?? true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    skills: data.skill_ids ? skills.filter(s => data.skill_ids?.includes(s.id)) : [],
    image_url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000",
    category: data.category || "Uncategorized",
    is_popular: false
  };

  services = [newService, ...services];
  revalidatePath("/admin/services");
  return success(newService, "Tạo dịch vụ thành công");
}

export async function cloneService(id: string): Promise<ActionResponse> {
  try {
    const serviceRes = await getService(id);
    if (serviceRes.status === "error") {
      return error(serviceRes.message || "Không thể tải dịch vụ");
    }
    const service = serviceRes.data;
    if (!service) {
      return error("Không tìm thấy dịch vụ để nhân bản");
    }

    const cloneData: ServiceCreateInput = {
      name: `${service.name} (Sao chép)`,
      duration: service.duration,
      buffer_time: service.buffer_time,
      price: service.price,
      is_active: false,
      skill_ids: service.skills.map((s) => s.id),
      new_skills: [],
      category: service.category || undefined,
      description: service.description || undefined,
    };

    const createRes = await createService(cloneData);
    if (createRes.status === "error") {
      return error(createRes.message || "Lỗi khi tạo dịch vụ nhân bản");
    }
    return success(undefined, "Nhân bản dịch vụ thành công");
  } catch (err) {
    console.error("Lỗi nhân bản dịch vụ:", err);
    return error("Không thể nhân bản dịch vụ");
  }
}

export async function updateService(id: string, data: ServiceUpdateInput): Promise<ActionResponse<Service>> {
  const validation = serviceSchema.partial().safeParse(data);
  if (!validation.success) {
    return error("Dữ liệu không hợp lệ", validation.error.flatten().fieldErrors);
  }

  await new Promise((resolve) => setTimeout(resolve, 600));

  const index = services.findIndex((s) => s.id === id);
  if (index === -1) {
    return error("Không tìm thấy dịch vụ");
  }

  const updatedService = {
    ...services[index],
    ...data,
    updated_at: new Date().toISOString(),
    skills: data.skill_ids ? skills.filter(s => data.skill_ids?.includes(s.id)) : services[index].skills,
  };

  services[index] = updatedService;
  revalidatePath("/admin/services");
  return success(updatedService, "Cập nhật dịch vụ thành công");
}

export async function deleteService(id: string): Promise<ActionResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  services = services.filter((s) => s.id !== id);
  revalidatePath("/admin/services");
  return success(undefined, "Đã xóa dịch vụ thành công");
}

export async function getSkills(
  page = 1,
  limit = 10
): Promise<ActionResponse<PaginatedResponse<Skill>>> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = skills.slice(start, end);

    return success({
        data: data,
        total: skills.length,
        page: page,
        limit: limit
    });
}

export async function createSkill(data: SkillCreateInput): Promise<ActionResponse<Skill>> {
  const validation = skillSchema.safeParse(data);
  if (!validation.success) {
    return error("Dữ liệu không hợp lệ", validation.error.flatten().fieldErrors);
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  const newSkill: Skill = {
    id: `s${Date.now()}`,
    ...data,
  };

  skills = [...skills, newSkill];
  revalidatePath("/admin/services");
  return success(newSkill, "Đã tạo kỹ năng thành công");
}

export async function updateSkill(id: string, data: SkillUpdateInput): Promise<ActionResponse<Skill>> {
  const validation = skillSchema.partial().safeParse(data);
  if (!validation.success) {
    return error("Dữ liệu không hợp lệ", validation.error.flatten().fieldErrors);
  }

  await new Promise((resolve) => setTimeout(resolve, 500));
  const index = skills.findIndex((s) => s.id === id);
    if (index === -1) {
    return error("Không tìm thấy kỹ năng");
  }

  const updatedSkill = { ...skills[index], ...data };
  skills[index] = updatedSkill;

  revalidatePath("/admin/services");
  return success(updatedSkill, "Đã cập nhật kỹ năng thành công");
}

export async function deleteSkill(id: string): Promise<ActionResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    skills = skills.filter(s => s.id !== id);
  revalidatePath("/admin/services");
  return success(undefined, "Đã xóa kỹ năng thành công");
}
