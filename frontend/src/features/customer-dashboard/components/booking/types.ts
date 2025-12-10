import { Service } from "@/features/services/types"
import { Staff } from "@/features/staff"

export type BookingStep = "preference" | "staff-select" | "time-select" | "confirm" | "success"

export type BookingPreference = "any" | "specific"

export interface BookingState {
    step: BookingStep
    preference: BookingPreference
    selectedStaff: Staff | null
    selectedDate: Date | undefined
    selectedTime: string | null
}

export interface BookingStepProps {
    service: Service
    state: BookingState
    onNext: () => void
    onBack: () => void
    updateState: (updates: Partial<BookingState>) => void
    isSubmitting?: boolean
}
