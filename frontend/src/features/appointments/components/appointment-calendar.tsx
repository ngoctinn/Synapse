"use client"

import { useMemo } from "react"
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  addWeeks, 
  subWeeks, 
  getHours,
  getMinutes,
  differenceInMinutes
} from "date-fns"
import { Appointment } from "../types"
import { Staff } from "@/features/staff"
import { useFilterParams } from "@/shared/lib/hooks/use-filter-params"
import { STAFF_COLORS, START_HOUR, END_HOUR, ROW_HEIGHT } from "../constants"
import { CalendarHeader } from "./calendar-header"
import { CalendarGrid } from "./calendar-grid"

interface AppointmentCalendarProps {
  appointments: Appointment[]
  staffList: Staff[]
}

// Tạo danh sách giờ từ START_HOUR đến END_HOUR
const HOURS = Array.from(
  { length: END_HOUR - START_HOUR + 1 }, 
  (_, i) => i + START_HOUR
)

export function AppointmentCalendar({ appointments, staffList }: AppointmentCalendarProps) {
  const { searchParams, updateParam } = useFilterParams()

  // Lấy ngày từ URL hoặc mặc định là hôm nay
  const dateFromParam = searchParams.get("date_from")
  const currentDate = dateFromParam ? new Date(dateFromParam) : new Date()

  // Xác định ngày bắt đầu và kết thúc của tuần hiện tại (Bắt đầu từ Thứ 2)
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 })
  const endDate = endOfWeek(currentDate, { weekStartsOn: 1 })
  
  // Tạo danh sách các ngày trong tuần để hiển thị cột
  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  })

  // Ánh xạ ID nhân viên sang màu sắc
  const staffColorMap = useMemo(() => {
    const map: Record<string, string> = {}
    staffList.forEach((staff, index) => {
      map[staff.id] = STAFF_COLORS[index % STAFF_COLORS.length]
    })
    return map
  }, [staffList])

  // Tối ưu Performance: Group appointments theo ngày
  const dailyAppointments = useMemo(() => {
    const grouped: Record<string, Appointment[]> = {}
    appointments.forEach(apt => {
      const dateKey = format(apt.startTime, "yyyy-MM-dd")
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(apt)
    })
    return grouped
  }, [appointments])

  const nextWeek = () => {
    const nextDate = addWeeks(currentDate, 1)
    updateParam("date_from", format(nextDate, "yyyy-MM-dd"))
  }
  
  const prevWeek = () => {
    const prevDate = subWeeks(currentDate, 1)
    updateParam("date_from", format(prevDate, "yyyy-MM-dd"))
  }
  
  const goToToday = () => {
    updateParam("date_from", format(new Date(), "yyyy-MM-dd"))
  }

  // Tính toán style (vị trí và chiều cao) cho thẻ lịch hẹn
  const getAppointmentStyle = (apt: Appointment) => {
    const start = apt.startTime
    const end = apt.endTime
    const startHour = getHours(start)
    const startMin = getMinutes(start)
    const duration = differenceInMinutes(end, start)
    
    // Tính toán vị trí top dựa trên giờ bắt đầu (so với START_HOUR)
    // Mỗi giờ tương ứng với ROW_HEIGHT px
    const minutesFromStart = (startHour - START_HOUR) * 60 + startMin
    const top = (minutesFromStart / 60) * ROW_HEIGHT 
    
    // Tính chiều cao dựa trên thời lượng
    const height = (duration / 60) * ROW_HEIGHT

    return {
      top: `${top}px`,
      height: `${height}px`,
    }
  }

  // Lấy màu dựa trên nhân viên
  const getAppointmentColor = (staffId: string) => {
    return staffColorMap[staffId] || "bg-slate-500"
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border overflow-hidden">
      <CalendarHeader 
        currentDate={currentDate}
        onNextWeek={nextWeek}
        onPrevWeek={prevWeek}
        onGoToToday={goToToday}
      />

      <CalendarGrid 
        days={days}
        hours={HOURS}
        dailyAppointments={dailyAppointments}
        getAppointmentStyle={getAppointmentStyle}
        getAppointmentColor={getAppointmentColor}
      />
    </div>
  )
}
