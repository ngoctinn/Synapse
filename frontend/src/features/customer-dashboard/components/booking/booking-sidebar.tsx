"use client"

import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { CalendarIcon, Sparkles, User } from "lucide-react"

import { Service } from "@/features/services/types"
import { cn } from "@/shared/lib/utils"
import { Badge } from "@/shared/ui/badge"
import { Separator } from "@/shared/ui/separator"
import { BookingState } from "./types"

interface BookingSidebarProps {
    service: Service
    state: BookingState
    className?: string
}

export function BookingSidebar({ service, state, className }: BookingSidebarProps) {
    const { selectedDate, selectedTime, selectedStaff, preference } = state

    return (
        <div className={cn("flex flex-col h-full bg-muted/30 border-r", className)}>
            <div className="p-6 space-y-6">
                {/* Service Header */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm leading-tight">{service.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                                {service.duration} phút
                            </p>
                        </div>
                    </div>
                    <div className="text-2xl font-serif font-medium text-primary">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}
                    </div>
                </div>

                <Separator />

                {/* Selection Summary */}
                <div className="space-y-5">
                    {/* Date & Time */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarIcon className="h-4 w-4" />
                            <span className="font-medium text-foreground">Thời gian</span>
                        </div>
                        <div className="pl-6 space-y-1">
                            <div className={cn("text-sm transition-colors", selectedDate ? "text-foreground" : "text-muted-foreground/50")}>
                                {selectedDate ? format(selectedDate, "EEEE, dd/MM/yyyy", { locale: vi }) : "Chưa chọn ngày"}
                            </div>
                            <div className={cn("text-sm transition-colors", selectedTime ? "text-foreground" : "text-muted-foreground/50")}>
                                {selectedTime ? selectedTime : "Chưa chọn giờ"}
                            </div>
                        </div>
                    </div>

                    {/* Staff */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span className="font-medium text-foreground">Chuyên gia</span>
                        </div>
                        <div className="pl-6">
                            {preference === "any" ? (
                                <Badge variant="secondary" className="font-normal bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                                    Mặc định (Tối ưu)
                                </Badge>
                            ) : selectedStaff ? (
                                <div className="space-y-1">
                                    <div className="text-sm font-medium">{selectedStaff.user.full_name}</div>
                                    <div className="text-xs text-muted-foreground">{selectedStaff.title}</div>
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground/50">Chưa chọn chuyên gia</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Total Footer */}
            <div className="mt-auto p-6 bg-background/50 border-t">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Tạm tính</span>
                    <span className="font-medium">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}
                    </span>
                </div>
                <div className="text-xs text-muted-foreground">
                    *Thanh toán tại quầy sau khi sử dụng dịch vụ
                </div>
            </div>
        </div>
    )
}
