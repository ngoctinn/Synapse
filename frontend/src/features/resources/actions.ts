"use server";

import { revalidatePath } from "next/cache";
import { mockMaintenanceTasks, mockResources } from "./model/mocks";
import { ResourceFormValues } from "./model/schema";
import { MaintenanceTask, Resource } from "./model/types";


let resources = [...mockResources];
let maintenanceTasks = [...mockMaintenanceTasks];

export async function getResources(query?: string): Promise<Resource[]> {

  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!query) return resources;

  const lowerQuery = query.toLowerCase();
  return resources.filter(
    (r) =>
      r.name.toLowerCase().includes(lowerQuery) ||
      r.code.toLowerCase().includes(lowerQuery)
  );
}

export async function getResourceById(id: string): Promise<Resource | undefined> {
  return resources.find((r) => r.id === id);
}

export async function createResource(data: ResourceFormValues): Promise<Resource> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newResource: Resource = {
    id: Math.random().toString(36).substring(7),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...data,
    capacity: data.type === 'ROOM' ? data.capacity : undefined,
  } as Resource;

  resources = [newResource, ...resources];
  revalidatePath("/resources");
  return newResource;
}

export async function updateResource(id: string, data: ResourceFormValues): Promise<Resource> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const index = resources.findIndex((r) => r.id === id);
  if (index === -1) throw new Error("Resource not found");

  const updatedResource = {
    ...resources[index],
    ...data,
    updatedAt: new Date().toISOString(),
     capacity: data.type === 'ROOM' ? data.capacity : undefined,
  } as Resource;

  resources[index] = updatedResource;
  revalidatePath("/resources");
  return updatedResource;
}

export async function deleteResource(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  resources = resources.filter((r) => r.id !== id);
  revalidatePath("/resources");
}



export async function getRoomTypes(): Promise<Resource[]> {

  return getResources().then(res => res.filter(r => r.type === 'ROOM'));
}

export async function getEquipmentList(): Promise<Resource[]> {

  return getResources().then(res => res.filter(r => r.type === 'EQUIPMENT'));
}

export async function getMaintenanceTasks(): Promise<MaintenanceTask[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return maintenanceTasks;
}
