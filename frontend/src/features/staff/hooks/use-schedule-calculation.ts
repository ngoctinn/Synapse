
import { Schedule } from "../model/types"

export function useScheduleCalculation(serverSchedules: Schedule[], localSchedules: Schedule[]) {
    // Computed: Is Dirty?
    // Naive check: stringify comparison (ok for small datasets like 1 week roster)
    const isDirty = JSON.stringify(serverSchedules) !== JSON.stringify(localSchedules)

    const calculateDiff = () => {
        const creates: Schedule[] = []
        const deletes: string[] = []

        const localIds = new Set(localSchedules.map(s => s.id))

        // Deletes: Exists in Server but NOT in Local
        serverSchedules.forEach(s => {
            if (!localIds.has(s.id)) {
                deletes.push(s.id)
            }
        })

        // Creates: ID starts with "temp_"
        localSchedules.forEach(s => {
            if (s.id.startsWith("temp_")) {
                creates.push(s)
            }
        })

        return { creates, deletes }
    }

    return {
        isDirty,
        calculateDiff
    }
}
