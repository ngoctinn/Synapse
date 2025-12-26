"use client";

import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
  Calendar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  TimePicker,
} from "@/shared/ui";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/shared/lib/utils";
import { AlertTriangle, CalendarIcon } from "lucide-react";
import { Icon } from "@/shared/ui/custom/icon";
import type { QuickAppointmentFormValues } from "@/features/appointments/model/schemas";

interface AppointmentDateTimeProps {
  timeWarning?: string | null;
  conflicts: Array<{ eventId: string; message: string }>;
}

export function AppointmentDateTime({
  timeWarning,
  conflicts,
}: AppointmentDateTimeProps) {
  const { control } = useFormContext<QuickAppointmentFormValues>();

  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Ngày</FormLabel>
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal pl-3",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                    {field.value ? format(field.value, "dd/MM/yyyy") : <span>Chọn ngày</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                    locale={vi}
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="startTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Giờ bắt đầu</FormLabel>
            <FormControl>
              <TimePicker value={field.value} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Warnings */}
      {(timeWarning || conflicts.length > 0) && (
        <div className="col-span-2 space-y-1 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-800 dark:bg-amber-950/20">
          {timeWarning && (
            <div className="flex items-center gap-2 font-medium text-amber-800 dark:text-amber-500">
              <Icon icon={AlertTriangle} /> {timeWarning}
            </div>
          )}
          {conflicts.map((c) => (
            <div
              key={c.eventId}
              className="text-destructive flex items-center gap-2 font-medium"
            >
              <Icon icon={AlertTriangle} /> {c.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
