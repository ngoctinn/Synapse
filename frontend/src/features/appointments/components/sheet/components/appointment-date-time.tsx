"use client";

import { useFormContext } from "react-hook-form";
import { AlertTriangle } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui";
import { Icon } from "@/shared/ui/custom/icon";
import { DatePicker } from "@/shared/ui/custom/date-picker";
import { TimePicker } from "@/shared/ui/custom/time-picker";
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
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                placeholder="Chọn ngày"
                minDate={new Date()}
              />
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
