"use client"

import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { AlertCircle, Calendar as CalendarIcon, Clock } from "lucide-react"
import { useFormContext } from "react-hook-form"

import { cn } from "@/shared/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert"
import { Button } from "@/shared/ui/button"
import { Calendar } from "@/shared/ui/calendar"
import { TimePicker } from "@/shared/ui/custom/time-picker"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover"

interface TimeSelectionProps {
    estimatedEndTime: string | null
    selectedServiceName?: string
    selectedServiceDuration?: number
    startTimeStr?: string
    conflictWarning?: string | null
}

export function TimeSelectionField({
    estimatedEndTime,
    selectedServiceName,
    selectedServiceDuration,
    startTimeStr,
    conflictWarning
}: TimeSelectionProps) {
    const { control } = useFormContext()

    return (
        <div className="space-y-4">
             <div className="flex items-center gap-2 pb-2">
                <h3 className="text-sm font-semibold text-foreground">Thời gian</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className="text-foreground/80 font-normal">Ngày hẹn</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "h-10 w-full pl-3 text-left font-normal rounded-lg border-input bg-background transition-all shadow-sm hover:shadow-md hover:border-input focus-premium",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                                            {field.value ? (
                                                format(new Date(field.value), "dd/MM/yyyy", { locale: vi })
                                            ) : (
                                                <span>Chọn ngày</span>
                                            )}
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value ? new Date(field.value) : undefined}
                                        onSelect={(date: Date | undefined) => field.onChange(date ? format(date, 'yyyy-MM-dd') : "")}
                                        disabled={(date: Date) =>
                                            date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="startTime"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-foreground/80 font-normal">Giờ bắt đầu</FormLabel>
                            <FormControl>
                                <TimePicker
                                    value={field.value}
                                    onChange={field.onChange}
                                    className="h-10 rounded-lg shadow-sm hover:shadow-md hover:border-input transition-all font-normal focus-premium"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {conflictWarning && (
                <Alert variant="destructive" className="mt-2 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Trùng lịch!</AlertTitle>
                    <AlertDescription>
                        {conflictWarning}
                    </AlertDescription>
                </Alert>
            )}

            {estimatedEndTime && selectedServiceName && (
                <div className="rounded-lg bg-primary/5 border border-primary/10 p-3 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
                    <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div className="text-sm">
                        <p className="font-medium text-primary mb-0.5">Thời gian dự kiến</p>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                            {selectedServiceName} ({selectedServiceDuration}p): <span className="font-medium text-foreground">{startTimeStr}</span> — <span className="font-medium text-foreground">{estimatedEndTime}</span>
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
