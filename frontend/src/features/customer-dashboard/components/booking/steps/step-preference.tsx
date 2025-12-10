"use client"

import { Check, User, Users } from "lucide-react"

import { cn } from "@/shared/lib/utils"
import { Badge } from "@/shared/ui/badge"
import { BookingStepProps } from "../types"

export function StepPreference({ state, updateState }: BookingStepProps) {
    const { preference } = state

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2 text-center">
                <h3 className="text-xl font-serif font-medium text-foreground">
                    Bạn muốn đặt lịch như thế nào?
                </h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                    Chúng tôi sẽ giúp bạn tìm khung giờ phù hợp nhất.
                </p>
            </div>

            <div className="grid gap-4 max-w-md mx-auto">
                {/* Option 1: Any Staff (Optimized) */}
                <div
                    className={cn(
                        "relative group rounded-xl border-2 p-5 transition-all cursor-pointer",
                        preference === "any"
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-muted bg-card hover:border-primary/50 hover:bg-accent"
                    )}
                    onClick={() => updateState({ preference: "any" })}
                >
                    {preference === "any" && (
                        <div className="absolute top-4 right-4">
                            <div className="h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                                <Check className="h-3 w-3" />
                            </div>
                        </div>
                    )}

                    <div className="flex items-start gap-4">
                        <div className={cn(
                            "rounded-full p-3 transition-colors shrink-0",
                            preference === "any" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                        )}>
                            <Users className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-base">Linh hoạt (Khuyên dùng)</span>
                                <Badge variant="secondary" className="text-[10px] h-5 px-2 bg-primary/10 text-primary hover:bg-primary/20">
                                    Nhanh nhất
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Hệ thống sẽ tự động chọn chuyên gia có tay nghề tốt nhất phù hợp với khung giờ của bạn.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Option 2: Specific Staff */}
                <div
                    className={cn(
                        "relative group rounded-xl border-2 p-5 transition-all cursor-pointer",
                        preference === "specific"
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-muted bg-card hover:border-primary/50 hover:bg-accent"
                    )}
                    onClick={() => updateState({ preference: "specific" })}
                >
                     {preference === "specific" && (
                        <div className="absolute top-4 right-4">
                            <div className="h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                                <Check className="h-3 w-3" />
                            </div>
                        </div>
                    )}

                    <div className="flex items-start gap-4">
                        <div className={cn(
                            "rounded-full p-3 transition-colors shrink-0",
                            preference === "specific" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                        )}>
                            <User className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <span className="font-semibold text-base block">Chọn chuyên gia cụ thể</span>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Bạn đã có chuyên gia yêu thích? Hãy chọn họ để đảm bảo trải nghiệm quen thuộc.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
