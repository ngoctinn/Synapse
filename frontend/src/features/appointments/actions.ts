"use server"

import { MOCK_APPOINTMENTS, MOCK_RESOURCES } from "./mock-data"
import { Appointment, Resource } from "./types"

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
