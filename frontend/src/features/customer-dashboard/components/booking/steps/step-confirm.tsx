"use client"

import { Check, Info, ShieldCheck } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert"
import { BookingStepProps } from "../types"

export function StepConfirm({ state }: BookingStepProps) {
    const { selectedDate, selectedTime, selectedStaff, preference, step } = state

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
                <h3 className="text-xl font-serif font-medium">Xác nhận thông tin</h3>
                <p className="text-muted-foreground text-sm">
                    Vui lòng kiểm tra kỹ lại thông tin đặt lịch trước khi xác nhận.
                </p>
            </div>

            {/* Policy Notice */}
            <Alert className="bg-orange-500/10 border-orange-500/20">
                <Info className="size-4 text-orange-600 dark:text-orange-400" />
                <AlertTitle className="text-orange-700 dark:text-orange-400 font-medium text-sm">
                    Lưu ý quan trọng
                </AlertTitle>
                <AlertDescription className="text-orange-600/90 dark:text-orange-400/90 text-xs mt-1 leading-relaxed">
                    Vui lòng đến sớm 10 phút để làm thủ tục check-in. Nếu đến muộn quá 15 phút,
                    hệ thống sẽ tự động dời lịch của bạn sang khung giờ trống tiếp theo để đảm bảo chất lượng phục vụ.
                </AlertDescription>
            </Alert>

            {/* Privacy & Terms */}
            <div className="flex items-start gap-3 p-4 rounded-xl border bg-card">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="size-4 text-primary" />
                </div>
                <div className="space-y-1">
                    <h4 className="font-medium text-sm">Chính sách bảo mật</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Thông tin của bạn được bảo mật tuyệt đối. Bằng việc xác nhận, bạn đồng ý với
                        <span className="text-primary hover:underline cursor-pointer ml-1">Điều khoản dịch vụ</span> của chúng tôi.
                    </p>
                </div>
            </div>

            {/* Added value */}
             <div className="flex items-start gap-3 p-4 rounded-xl border border-dashed bg-muted/30">
                <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                    <Check className="size-4 text-green-600" />
                </div>
                <div className="space-y-1">
                    <h4 className="font-medium text-sm text-foreground">Quyền lợi đặt trước</h4>
                    <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-0.5">
                        <li>Ưu tiên chọn phòng có view đẹp</li>
                        <li>Miễn phí trà thảo mộc đón khách</li>
                        <li>Tích điểm thành viên x2</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
