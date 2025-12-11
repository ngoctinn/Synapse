"use client"

import { Star } from "lucide-react"

import { MOCK_STAFF } from "@/features/staff"
import { cn } from "@/shared/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Badge } from "@/shared/ui/badge"
import { ScrollArea } from "@/shared/ui/scroll-area"
import { BookingStepProps } from "../types"

export function StepStaff({ state, updateState }: BookingStepProps) {
    const { selectedStaff } = state
    const staffList = MOCK_STAFF.filter(s => s.user.is_active !== false)

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col">
            <div className="flex items-center justify-between shrink-0">
                <h3 className="text-lg font-serif font-medium">Chọn chuyên gia</h3>
                <Badge variant="outline" className="text-xs">
                    {staffList.length} chuyên gia sẵn sàng
                </Badge>
            </div>

            <ScrollArea className="flex-1 -mr-4 pr-4">
                <div className="grid grid-cols-1 gap-3 pb-4">
                    {staffList.map((staff) => (
                        <button
                            key={staff.user_id}
                            type="button"
                            onClick={() => updateState({ selectedStaff: staff })}
                            className={cn(
                                "relative w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer text-left outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                                selectedStaff?.user_id === staff.user_id
                                    ? "border-primary bg-primary/5 shadow-md"
                                    : "border-transparent bg-card hover:bg-accent hover:border-muted-foreground/20 shadow-sm"
                            )}
                        >
                            <Avatar className="h-16 w-16 border-2 border-background shadow-sm shrink-0">
                                <AvatarImage src={staff.user.avatar_url || undefined} alt={staff.user.full_name || ""} />
                                <AvatarFallback className="font-serif text-lg">{staff.user.full_name?.[0] || "?"}</AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <div className="font-semibold text-base truncate">{staff.user.full_name}</div>
                                        <div className="text-sm text-muted-foreground">{staff.title}</div>
                                    </div>
                                    <Badge variant="warning" className="flex items-center gap-1.5 h-6">
                                        <Star className="h-3 w-3 fill-current" />
                                        4.9
                                    </Badge>
                                </div>

                                <div className="flex flex-wrap gap-1.5">
                                    {staff.skills.slice(0, 3).map((skill) => (
                                        <span
                                            key={skill.id}
                                            className="text-[11px] px-2 py-0.5 bg-muted rounded-md text-muted-foreground border border-transparent"
                                        >
                                            {skill.name}
                                        </span>
                                    ))}
                                    {staff.skills.length > 3 && (
                                        <span className="text-[11px] px-2 py-0.5 bg-muted rounded-md text-muted-foreground">
                                            +{staff.skills.length - 3}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}
