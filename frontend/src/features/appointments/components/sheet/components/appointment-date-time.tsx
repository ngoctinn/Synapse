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
  DatePicker,
  TimePicker,
} from "@/shared/ui";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/shared/lib/utils";
import { AlertTriangle, CalendarIcon } from "lucide-react";
import { Icon } from "@/shared/ui/custom/icon";
import type { QuickAppointmentFormValues } from "@/features/appointments/model/schemas";
import { Stack, Grid } from "@/shared/ui/layout";

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
    <Grid gap={4} className="grid-cols-2">
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
                minDate={new Date(new Date().setHours(0, 0, 0, 0))}
                modal={true}
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
        <Stack gap={1} className="col-span-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-800 dark:bg-amber-950/20">
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
        </Stack>
      )}
    </Grid>
  );
}
