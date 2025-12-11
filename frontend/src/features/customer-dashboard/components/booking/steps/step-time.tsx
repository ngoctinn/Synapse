"use client"

import { format, getHours, parse } from "date-fns"
import { vi } from "date-fns/locale"
import { Clock, Info, LucideIcon, Moon, Sun, Sunrise } from "lucide-react"
import * as React from "react"

import { cn } from "@/shared/lib/utils"
import { Alert, AlertDescription } from "@/shared/ui/alert"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Calendar } from "@/shared/ui/calendar"
import { ScrollArea } from "@/shared/ui/scroll-area"
import { Skeleton } from "@/shared/ui/skeleton"
import { MOCK_SLOTS } from "../../../mocks"
import { TimeSlot } from "../../../types"
import { BookingStepProps } from "../types"

const TIME_SECTIONS: {
    key: 'morning' | 'afternoon' | 'evening';
    label: string;
    icon: LucideIcon;
    range: [number, number]; // [startHour, endHour)
}[] = [
    { key: 'morning', label: 'Buổi sáng', icon: Sunrise, range: [0, 12] },
    { key: 'afternoon', label: 'Buổi chiều', icon: Sun, range: [12, 17] },
    { key: 'evening', label: 'Buổi tối', icon: Moon, range: [17, 24] },
];

export function StepTime({ state, updateState }: BookingStepProps) {
    const { selectedDate, selectedTime, preference } = state
    const [isLoading, setIsLoading] = React.useState(false)

    // Simulate loading when date changes
    React.useEffect(() => {
        if (selectedDate) {
            setIsLoading(true)
            const timer = setTimeout(() => setIsLoading(false), 600)
            return () => clearTimeout(timer)
        }
    }, [selectedDate])

    const groupedSlots = React.useMemo(() => {
        const groups: Record<string, TimeSlot[]> = {
            morning: [],
            afternoon: [],
            evening: []
        };

        MOCK_SLOTS.forEach((slot: TimeSlot) => {
            // Safe parsing using date-fns
            const date = parse(slot.time, 'HH:mm', new Date());
            const hour = getHours(date);

            const section = TIME_SECTIONS.find(
                s => hour >= s.range[0] && hour < s.range[1]
            );

            if (section) {
                groups[section.key].push(slot);
            }
        });

        return groups;
    }, []);

    return (
        <div className="flex flex-col md:flex-row h-full gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Left: Calendar */}
            <div className="w-full md:w-[320px] shrink-0 space-y-4">
                <div className="rounded-xl border bg-card p-3 shadow-sm">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => updateState({ selectedDate: date, selectedTime: null })}
                        className="w-full"
                        classNames={{
                            head_cell: "text-muted-foreground font-normal text-xs w-10",
                            cell: "h-10 w-10 text-center text-sm p-0 relative",
                            day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-lg transition-all focus-visible:bg-accent focus-visible:text-accent-foreground",
                            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground shadow-md",
                            day_today: "bg-accent/50 text-accent-foreground font-medium ring-1 ring-inset ring-primary/20",
                        }}
                    />
                </div>

                {/* Legend/Info */}
                <Alert className="bg-muted/50 border-muted">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    <AlertDescription className="text-xs text-muted-foreground">
                        Các ngày màu xám là ngày nghỉ hoặc đã kín lịch.
                    </AlertDescription>
                </Alert>
            </div>

            {/* Right: Time Slots */}
            <div className="flex-1 min-w-0 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4 shrink-0">
                    <h3 className="font-serif font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        Giờ trống {selectedDate && format(selectedDate, "dd/MM", { locale: vi })}
                    </h3>
                    {preference === "any" && !isLoading && (
                        <Badge variant="outline" className="text-xs bg-alert-success text-alert-success-foreground border-alert-success-border">
                            Giờ vàng (Giảm 10%)
                        </Badge>
                    )}
                </div>

                <ScrollArea className="flex-1 -mr-4 pr-4 h-[300px]">
                    {isLoading ? (
                        <div className="space-y-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="space-y-3">
                                    <Skeleton className="h-5 w-24" />
                                    <div className="grid grid-cols-4 gap-2">
                                        <Skeleton className="h-10 w-full rounded-md" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6 pb-4">
                            {TIME_SECTIONS.map((section) => {
                                const slots = groupedSlots[section.key];
                                if (slots.length === 0) return null;

                                const Icon = section.icon;

                                return (
                                    <div key={section.key} className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                            <Icon className="h-4 w-4" /> {section.label}
                                        </div>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                            {slots.map((slot: TimeSlot) => (
                                                <TimeSlotButton
                                                    key={slot.time}
                                                    slot={slot}
                                                    selectedTime={selectedTime}
                                                    onClick={() => updateState({ selectedTime: slot.time })}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </ScrollArea>
            </div>
        </div>
    )
}

function TimeSlotButton({ slot, selectedTime, onClick }: { slot: TimeSlot, selectedTime: string | null, onClick: () => void }) {
    return (
        <Button
            type="button"
            variant={selectedTime === slot.time ? "default" : "outline"}
            className={cn(
                "relative h-10 w-full font-normal transition-all duration-200",
                selectedTime === slot.time ? "ring-2 ring-primary ring-offset-2 shadow-md scale-[1.02]" : "hover:border-primary/50 text-muted-foreground hover:text-foreground",
                slot.isRecommended && selectedTime !== slot.time && "border-alert-success-border bg-alert-success text-alert-success-foreground hover:bg-alert-success/80 hover:border-alert-success-border"
            )}
            onClick={onClick}
        >
             {slot.time}
             {slot.isRecommended && (
                 <span className="absolute -top-1 -right-1 h-2 w-2">
                     <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                 </span>
             )}
        </Button>
    )
}
