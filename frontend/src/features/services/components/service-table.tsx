"use client"

import { Badge } from "@/shared/ui/badge"
import {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/ui/table"
import { formatCurrency } from "@/shared/lib/utils"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"
import { Service, Skill } from "../types"
import { CreateServiceDialog } from "./create-service-dialog"
import { ServiceActions } from "./service-actions"
import { PaginationControls } from "@/shared/ui/custom/pagination-controls"

interface ServiceTableProps {
  services: Service[]
  availableSkills: Skill[]
  page?: number
  totalPages?: number
  onPageChange?: (page: number) => void
}

export function ServiceTable({ 
  services, 
  availableSkills,
  page = 1,
  totalPages = 1,
  onPageChange = () => {}
}: ServiceTableProps) {
  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border rounded-xl bg-white/50 backdrop-blur-sm border-dashed border-slate-300">
        <div className="p-4 rounded-full bg-blue-50 mb-4 animate-in zoom-in duration-500">
          <Plus className="w-10 h-10 text-blue-500" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900">Chưa có dịch vụ nào</h3>
        <p className="text-sm text-slate-500 max-w-sm mt-2 mb-6">
          Bắt đầu bằng cách tạo dịch vụ đầu tiên của bạn. Dịch vụ sẽ hiển thị trên trang đặt lịch.
        </p>
        <CreateServiceDialog availableSkills={availableSkills} />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full caption-bottom text-sm min-w-[1000px]">
          <TableHeader className="sticky top-0 z-20 bg-white/95 backdrop-blur shadow-sm">
            <TableRow>
              <TableHead className="bg-white pl-6">Tên dịch vụ</TableHead>
              <TableHead className="bg-white">Thời lượng</TableHead>
              <TableHead className="bg-white">Giá</TableHead>
              <TableHead className="bg-white">Kỹ năng yêu cầu</TableHead>
              <TableHead className="bg-white">Trạng thái</TableHead>
              <TableHead className="text-right bg-white pr-6">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service, index) => (
              <motion.tr
                key={service.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="hover:bg-blue-50/50 transition-colors border-b last:border-0"
              >
                <TableCell className="font-medium pl-6">
                  <div className="flex flex-col">
                    <span>{service.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-xs">
                    <span className="font-medium">Phục vụ: {service.duration}p</span>
                    <span className="text-slate-500">Nghỉ: {service.buffer_time}p</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-slate-700">
                  {formatCurrency(service.price)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {service.skills.map((skill) => (
                      <Badge key={skill.id} variant="secondary" className="text-[10px] px-1.5 py-0">
                        {skill.name}
                      </Badge>
                    ))}
                    {service.skills.length === 0 && (
                      <span className="text-xs text-slate-400 italic">Không yêu cầu</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={service.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}>
                    {service.is_active ? (
                        <span className="flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Hoạt động
                        </span>
                    ) : (
                        <span className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                            Ẩn
                        </span>
                    )}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <ServiceActions service={service} availableSkills={availableSkills} />
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </table>
      </div>
      <div className="px-4 pb-4">
        <PaginationControls 
          currentPage={page} 
          totalPages={totalPages} 
          onPageChange={onPageChange} 
        />
      </div>
    </div>
  )
}

export function ServiceTableSkeleton() {
  return (
    <div className="rounded-md border bg-white shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
           <div className="h-8 w-64 bg-slate-100 rounded animate-pulse" />
           <div className="h-8 w-32 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-12 w-full bg-slate-50 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
