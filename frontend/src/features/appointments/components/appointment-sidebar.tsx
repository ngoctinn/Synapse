"use client"

import { Button } from "@/shared/ui/button"
import { Staff } from "@/features/staff"
import { Service } from "@/features/services"
import { useFilterParams } from "@/shared/lib/hooks/use-filter-params"
import { cn } from "@/shared/lib/utils"
import { Checkbox } from "@/shared/ui/checkbox"
import { Label } from "@/shared/ui/label"
import { ScrollArea } from "@/shared/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { STAFF_COLORS } from "../constants"
import { motion, AnimatePresence } from "framer-motion"
import { Clock } from "lucide-react"

interface AppointmentSidebarProps {
  staffList: Staff[]
  serviceList: Service[]
  className?: string
}

// Dữ liệu giả lập cho hàng chờ bệnh nhân (Mock Data)
const PATIENT_QUEUE = [
  { id: 1, name: "Nguyễn Văn An", time: "08:30 • Cấy ghép Implant", avatar: "https://i.pravatar.cc/150?u=1" },
  { id: 2, name: "Trần Thị Bích", time: "09:00 • Tẩy trắng răng", avatar: "https://i.pravatar.cc/150?u=2" },
  { id: 3, name: "Lê Hoàng Nam", time: "09:45 • Nhổ răng khôn", avatar: "https://i.pravatar.cc/150?u=3" },
]

export function AppointmentSidebar({ staffList, serviceList, className }: AppointmentSidebarProps) {
  const { searchParams, updateParam, updateParams } = useFilterParams()
  
  // Trạng thái Lọc Nhân viên
  const staffParam = searchParams.get("staff_id")
  const selectedStaffIds = staffParam ? staffParam.split(",") : []

  // Trạng thái Lọc Dịch vụ
  const serviceParam = searchParams.get("service_id") 
  const selectedServiceIds = serviceParam ? serviceParam.split(",") : []

  const handleStaffToggle = (staffId: string) => {
    const newSelectedIds = selectedStaffIds.includes(staffId)
      ? selectedStaffIds.filter(id => id !== staffId)
      : [...selectedStaffIds, staffId]
    
    updateParam("staff_id", newSelectedIds.length > 0 ? newSelectedIds.join(",") : null)
  }

  const handleServiceToggle = (serviceId: string) => {
    const newSelectedIds = selectedServiceIds.includes(serviceId)
      ? selectedServiceIds.filter(id => id !== serviceId)
      : [...selectedServiceIds, serviceId]
      
    updateParam("service_id", newSelectedIds.length > 0 ? newSelectedIds.join(",") : null)
  }

  const hasActiveFilters = selectedStaffIds.length > 0 || selectedServiceIds.length > 0

  return (
    <div className={cn("flex flex-col h-full border-r bg-white w-[280px] shrink-0 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] z-10", className)}>
      {/* Nút Reset Filter */}
      <div className="p-3 border-b space-y-3">
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
               <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs h-8 bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                onClick={() => {
                  updateParams({
                    staff_id: null,
                    service_id: null
                  })
                }}
              >
                Đặt lại bộ lọc
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-8">
          {/* Bộ lọc Nhân viên */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
              Bác sĩ / Kỹ thuật viên
            </h3>
            <div className="space-y-1">
              <motion.div 
                whileHover={{ x: 2 }}
                className={cn(
                  "flex items-center space-x-3 p-2 rounded-lg transition-colors cursor-pointer hover:bg-slate-50",
                  selectedStaffIds.length === 0 && "bg-blue-50/50"
                )}
                onClick={() => updateParam("staff_id", null)}
              >
                <Checkbox 
                  id="staff-all" 
                  checked={selectedStaffIds.length === 0}
                  onCheckedChange={() => updateParam("staff_id", null)}
                  className="data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900"
                />
                <Label htmlFor="staff-all" className="text-sm font-medium cursor-pointer flex-1 text-slate-700">
                  Tất cả nhân viên
                </Label>
              </motion.div>
              
              {staffList.length === 0 ? (
                <div className="text-xs text-slate-400 italic p-2 text-center">
                  Không có nhân viên nào
                </div>
              ) : (
                staffList.map((staff, index) => {
                  const colorClass = STAFF_COLORS[index % STAFF_COLORS.length]
                  const isSelected = selectedStaffIds.includes(staff.id)
                  return (
                    <motion.div 
                      key={staff.id} 
                      whileHover={{ x: 2, backgroundColor: "rgba(248, 250, 252, 1)" }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "flex items-center space-x-3 p-2 rounded-lg transition-all cursor-pointer group border border-transparent",
                        isSelected 
                          ? "bg-slate-50 shadow-sm border-slate-100" 
                          : "hover:bg-slate-50"
                      )}
                      onClick={() => handleStaffToggle(staff.id)}
                    >
                      <Checkbox 
                        id={`staff-${staff.id}`}
                        checked={isSelected}
                        onCheckedChange={() => handleStaffToggle(staff.id)}
                        className={cn(
                          "transition-colors",
                          isSelected ? cn(colorClass, "border-transparent text-white") : "border-slate-300"
                        )}
                      />
                      <Label 
                        htmlFor={`staff-${staff.id}`} 
                        className="flex-1 flex items-center gap-3 cursor-pointer text-sm font-normal"
                      >
                        <div className="relative">
                          <Avatar className={cn("h-8 w-8 border border-slate-100 shadow-sm transition-transform", isSelected && "scale-105 ring-2 ring-offset-1 ring-slate-100")}>
                            <AvatarImage src={staff.avatarUrl} />
                            <AvatarFallback className="text-[10px] bg-slate-50 text-slate-500">{staff.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {/* Dot indicator */}
                          <span className={cn("absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white", colorClass)} />
                        </div>
                        <span className={cn("truncate transition-colors text-slate-600", isSelected ? "font-semibold text-slate-900" : "group-hover:text-slate-900")}>
                          {staff.name}
                        </span>
                      </Label>
                    </motion.div>
                  )
                })
              )}
            </div>
          </div>

          {/* Bộ lọc Dịch vụ */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
              Loại điều trị
            </h3>
            <div className="space-y-1">
               <motion.div 
                whileHover={{ x: 2 }}
                className={cn(
                  "flex items-center space-x-3 p-2 rounded-lg transition-colors cursor-pointer hover:bg-slate-50",
                  selectedServiceIds.length === 0 && "bg-blue-50/50"
                )}
                onClick={() => updateParam("service_id", null)}
              >
                <Checkbox 
                  id="service-all" 
                  checked={selectedServiceIds.length === 0}
                  onCheckedChange={() => updateParam("service_id", null)}
                  className="data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900"
                />
                <Label htmlFor="service-all" className="text-sm font-medium cursor-pointer flex-1 text-slate-700">
                  Tất cả dịch vụ
                </Label>
              </motion.div>
              {serviceList.length === 0 ? (
                <div className="text-xs text-slate-400 italic p-2 text-center">
                  Không có dịch vụ nào
                </div>
              ) : (
                serviceList.map((service) => {
                  const isSelected = selectedServiceIds.includes(service.id)
                  return (
                    <motion.div 
                      key={service.id} 
                      whileHover={{ x: 2, backgroundColor: "rgba(248, 250, 252, 1)" }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "flex items-center space-x-3 p-2 rounded-lg transition-all cursor-pointer border border-transparent",
                        isSelected 
                          ? "bg-slate-50 shadow-sm border-slate-100" 
                          : "hover:bg-slate-50"
                      )}
                      onClick={() => handleServiceToggle(service.id)}
                    >
                      <Checkbox 
                        id={`service-${service.id}`}
                        checked={isSelected}
                        onCheckedChange={() => handleServiceToggle(service.id)}
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <Label 
                        htmlFor={`service-${service.id}`} 
                        className={cn("text-sm cursor-pointer truncate flex-1 text-slate-600", isSelected ? "font-medium text-blue-700" : "font-normal group-hover:text-slate-900")}
                      >
                        {service.name}
                      </Label>
                    </motion.div>
                  )
                })
              )}
            </div>
          </div>

          {/* Hàng chờ bệnh nhân (Mock Data) */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Hàng chờ khách hàng
              </h3>
              <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                {PATIENT_QUEUE.length}
              </span>
            </div>
            <div className="space-y-2">
              {PATIENT_QUEUE.map((patient) => (
                <motion.div
                  key={patient.id}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer group"
                >
                  <Avatar className="h-9 w-9 border border-slate-100">
                    <AvatarImage src={patient.avatar} />
                    <AvatarFallback className="text-xs bg-orange-50 text-orange-600">
                      {patient.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-700 group-hover:text-slate-900 truncate">
                      {patient.name}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                      <Clock className="h-3 w-3 text-slate-400" />
                      {patient.time}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
