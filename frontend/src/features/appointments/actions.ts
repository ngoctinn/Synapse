"use server"

import { MOCK_APPOINTMENTS, MOCK_CUSTOMERS, MOCK_RESOURCES } from "./mock-data"
import { Appointment, Customer, Resource } from "./types"

const SIMULATED_DELAY = 600 // ms

export async function getAppointments(filters?: any): Promise<Appointment[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY))

  let filtered = [...MOCK_APPOINTMENTS]

  // Future: Implement server-side filtering logic here using 'filters'

  return filtered
}

export async function getResources(): Promise<Resource[]> {
   await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY))
   return MOCK_RESOURCES
}

export async function getCustomers(): Promise<Customer[]> {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY))
    return MOCK_CUSTOMERS
}

export type ActionState = {
    success?: boolean;
    error?: string;
    message?: string;
    data?: Appointment;
};

export async function manageAppointment(prevState: ActionState, formData: FormData): Promise<ActionState> {

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));

    try {
        const rawData: any = {};
        formData.forEach((value, key) => {
             // Basic casting, assume string keys are mostly strings or dates
             if (key === 'startTime' || key === 'endTime') {
                 rawData[key] = new Date(value as string);
             } else {
                 rawData[key] = value;
             }
        });

        // Mock ID generation if not present
        if (!rawData.id) {
            rawData.id = `apt-${Date.now()}`;
            rawData.status = 'pending';
        }

        // Mock saving (in reality, validate and save to DB)

        // Return success
        return {
            success: true,
            message: rawData.id ? "Cập nhật thành công" : "Tạo mới thành công",
            data: rawData as Appointment
        }

    } catch (e) {
        return { success: false, error: "Có lỗi xảy ra" }
    }
}

export async function createAppointment(data: Omit<Appointment, "id">): Promise<Appointment> {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY))

    const newAppointment: Appointment = {
        ...data,
        id: `apt-${Date.now()}`,
        status: 'pending'
    }

    // In a real app, this would save to DB
    return newAppointment
}

export async function updateAppointment(data: Appointment): Promise<Appointment> {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY))
    return data
}

export async function cancelAppointment(id: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY))
    return id
}
