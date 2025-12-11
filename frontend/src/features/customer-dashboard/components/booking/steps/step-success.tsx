"use client"

import { CheckCircle2 } from "lucide-react"

import { Button } from "@/shared/ui/button"

interface StepSuccessProps {
    onClose: () => void
}

export function StepSuccess({ onClose }: StepSuccessProps) {
    return (
        <div className="flex flex-col items-center justify-center space-y-6 py-10 text-center animate-in zoom-in fade-in duration-300">
            <div className="relative">
                <div className="absolute inset-0 bg-success/20 rounded-full animate-ping" />
                <div className="relative h-20 w-20 bg-success text-success-foreground rounded-full flex items-center justify-center shadow-lg shadow-success/30">
                    <CheckCircle2 className="h-10 w-10" />
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="text-2xl font-serif font-semibold text-foreground">
                    Đặt lịch thành công!
                </h3>
                <p className="text-muted-foreground max-w-[280px] mx-auto text-sm">
                    Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi. Thông tin chi tiết đã được gửi qua Email & SMS.
                </p>
            </div>

            <Button onClick={onClose} size="lg" className="mt-4">
                Hoàn tất
            </Button>
        </div>
    )
}
