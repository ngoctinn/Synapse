import { TimeSlot } from "./types"

// MOCK_STAFF removed (Use @/features/staff/data/mocks)

export const MOCK_SLOTS: TimeSlot[] = [
  { time: "09:00" },
  { time: "09:30", isHighDemand: true },
  { time: "10:00", isRecommended: true },
  { time: "10:30" },
  { time: "11:00", isRecommended: true },
  { time: "13:30" },
  { time: "14:00", isRecommended: true },
  { time: "14:30", isHighDemand: true },
  { time: "15:00" },
  { time: "16:00", isRecommended: true },
]
