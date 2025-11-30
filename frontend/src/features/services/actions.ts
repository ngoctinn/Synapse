"use server";

import { fetchWithAuth } from "@/shared/lib/api";
import { revalidatePath } from "next/cache";
import { Service, ServiceCreateInput, ServiceUpdateInput, Skill } from "./types";

const SERVICE_TAG = "services";

export async function getServices(activeOnly = false): Promise<Service[]> {
  const query = activeOnly ? "?active=true" : "";
  const res = await fetchWithAuth(`/services${query}`, {
    method: "GET",
    next: { tags: [SERVICE_TAG] },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch services");
  }

  return res.json();
}

export async function getService(id: string): Promise<Service> {
  const res = await fetchWithAuth(`/services/${id}`, {
    method: "GET",
    next: { tags: [SERVICE_TAG] },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch service");
  }

  return res.json();
}

export async function createService(data: ServiceCreateInput): Promise<{ success: boolean; message?: string; data?: Service }> {
  const res = await fetchWithAuth("/services", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    return { success: false, message: error.detail || "Failed to create service" };
  }

  revalidatePath("/admin/services");
  return { success: true, data: await res.json() };
}

export async function updateService(id: string, data: ServiceUpdateInput): Promise<{ success: boolean; message?: string; data?: Service }> {
  const res = await fetchWithAuth(`/services/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    return { success: false, message: error.detail || "Failed to update service" };
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
    return { success: false, message: error.detail || "Failed to delete service" };
  }

  revalidatePath("/admin/services");
  return { success: true, message: "Service deleted successfully" };
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
