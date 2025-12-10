"use client"

import { Appointment } from "@/features/appointments/types"
import { areIntervalsOverlapping, isSameDay } from "date-fns"
import { useMemo } from "react"

interface UseAppointmentConflictProps {
    date: Date | string | undefined
    startTimeStr: string
    duration: number
    bufferTime: number
    resourceId?: string
    existingAppointments: Appointment[]
    currentAppointmentId?: string
}

export function useAppointmentConflict({
    date,
    startTimeStr,
    duration,
    bufferTime,
    resourceId,
    existingAppointments,
    currentAppointmentId
}: UseAppointmentConflictProps) {
    const conflictWarning = useMemo(() => {
        if (!date || !startTimeStr || !resourceId) return null;

        const dateObj = new Date(date);
        const [hours, minutes] = startTimeStr.split(':').map(Number);

        const startTime = new Date(dateObj);
        startTime.setHours(hours, minutes);

        // End time calculation including buffer
        const endTime = new Date(startTime.getTime() + (duration + bufferTime) * 60000);

        const hasConflict = existingAppointments.some(apt => {
            // 1. Filter by Day
            if (!isSameDay(startTime, apt.startTime)) return false;

            // 2. Skip current appointment (update mode)
            if (currentAppointmentId && apt.id === currentAppointmentId) return false;

            // 3. Skip different resources
            if (apt.resourceId !== resourceId) return false;

            // 4. Skip cancelled
            if (apt.status === 'cancelled') return false;

            // 5. Interval Check
            return areIntervalsOverlapping(
                { start: startTime, end: endTime },
                { start: apt.startTime, end: apt.endTime }
            );
        });

        if (hasConflict) {
            return "Nhân viên này đã có lịch hẹn trong khung giờ bạn chọn!";
        }
        return null;
    }, [date, startTimeStr, resourceId, duration, bufferTime, existingAppointments, currentAppointmentId]);

    return { conflictWarning };
}
