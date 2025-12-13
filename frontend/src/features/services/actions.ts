"use server";

import "server-only";

import { ActionResponse, error, success } from "@/shared/lib/action-response";
import { revalidatePath } from "next/cache";
import { MOCK_SERVICES, MOCK_SKILLS } from "./data/mocks";
import { serviceSchema, skillSchema } from "./schemas";
import { PaginatedResponse, Service, ServiceCreateInput, ServiceUpdateInput, Skill, SkillCreateInput, SkillUpdateInput } from "./types";

let services = [...MOCK_SERVICES];
let skills = [...MOCK_SKILLS];

export async function getServices(
  page = 1, limit = 10, search?: string, activeOnly = false
): Promise<ActionResponse<PaginatedResponse<Service>>> {
  let filtered = services;
  if (activeOnly) filtered = filtered.filter((s) => s.is_active);
  if (search) {
    const lower = search.toLowerCase();
    filtered = filtered.filter((s) => s.name.toLowerCase().includes(lower) || (s.description || "").toLowerCase().includes(lower));
  }

  const start = (page - 1) * limit;
  return success({
    data: filtered.slice(start, start + limit),
    total: filtered.length,
    page,
    limit,
  });
}

export async function getService(id: string): Promise<ActionResponse<Service>> {
  const service = services.find((s) => s.id === id);
  return service ? success(service) : error("Không tìm thấy dịch vụ");
}

export async function createService(data: ServiceCreateInput): Promise<ActionResponse<Service>> {
  const validation = serviceSchema.safeParse(data);
  if (!validation.success) return error("Dữ liệu không hợp lệ", validation.error.flatten().fieldErrors);

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
    if (serviceRes.status === "error" || !serviceRes.data) return error(serviceRes.message || "Không thể tải dịch vụ");

    const service = serviceRes.data;
    const createRes = await createService({
      name: `${service.name} (Sao chép)`,
      duration: service.duration,
      buffer_time: service.buffer_time,
      price: service.price,
      is_active: false,
      skill_ids: service.skills.map((s) => s.id),
      new_skills: [],
      category: service.category || undefined,
      description: service.description || undefined,
    });

    if (createRes.status === "error") return error(createRes.message || "Lỗi khi tạo dịch vụ nhân bản");
    return success(undefined, "Nhân bản dịch vụ thành công");
  } catch (err) {
    console.error("Lỗi nhân bản dịch vụ:", err);
    return error("Không thể nhân bản dịch vụ");
  }
}

export async function updateService(id: string, data: ServiceUpdateInput): Promise<ActionResponse<Service>> {
  const validation = serviceSchema.partial().safeParse(data);
  if (!validation.success) return error("Dữ liệu không hợp lệ", validation.error.flatten().fieldErrors);

  const index = services.findIndex((s) => s.id === id);
  if (index === -1) return error("Không tìm thấy dịch vụ");

  const updatedService = {
    ...services[index], ...data,
    updated_at: new Date().toISOString(),
    skills: data.skill_ids ? skills.filter(s => data.skill_ids?.includes(s.id)) : services[index].skills,
  };

  services[index] = updatedService;
  revalidatePath("/admin/services");
  return success(updatedService, "Cập nhật dịch vụ thành công");
}

export async function deleteService(id: string): Promise<ActionResponse> {
  services = services.filter((s) => s.id !== id);
  revalidatePath("/admin/services");
  return success(undefined, "Đã xóa dịch vụ thành công");
}

export async function getSkills(page = 1, limit = 10): Promise<ActionResponse<PaginatedResponse<Skill>>> {
    const start = (page - 1) * limit;
    return success({
        data: skills.slice(start, start + limit),
        total: skills.length,
        page,
        limit
    });
}

export async function createSkill(data: SkillCreateInput): Promise<ActionResponse<Skill>> {
  const validation = skillSchema.safeParse(data);
  if (!validation.success) return error("Dữ liệu không hợp lệ", validation.error.flatten().fieldErrors);

  const newSkill: Skill = { id: `s${Date.now()}`, ...data };
  skills = [...skills, newSkill];
  revalidatePath("/admin/services");
  return success(newSkill, "Đã tạo kỹ năng thành công");
}

export async function updateSkill(id: string, data: SkillUpdateInput): Promise<ActionResponse<Skill>> {
  const validation = skillSchema.partial().safeParse(data);
  if (!validation.success) return error("Dữ liệu không hợp lệ", validation.error.flatten().fieldErrors);

  const index = skills.findIndex((s) => s.id === id);
  if (index === -1) return error("Không tìm thấy kỹ năng");

  const updatedSkill = { ...skills[index], ...data };
  skills[index] = updatedSkill;

  revalidatePath("/admin/services");
  return success(updatedSkill, "Đã cập nhật kỹ năng thành công");
}

export async function deleteSkill(id: string): Promise<ActionResponse> {
  skills = skills.filter(s => s.id !== id);
  revalidatePath("/admin/services");
  return success(undefined, "Đã xóa kỹ năng thành công");
}
