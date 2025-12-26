"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";
import type { TimelineResource } from "@/features/appointments/model/types";
import type { QuickAppointmentFormValues } from "@/features/appointments/model/schemas";
import { Stack } from "@/shared/ui/layout";

interface StaffResourceSelectProps {
  availableStaff: TimelineResource[];
  availableResources: TimelineResource[];
}

export function StaffResourceSelect({
  availableStaff,
  availableResources,
}: StaffResourceSelectProps) {
  const { control } = useFormContext<QuickAppointmentFormValues>();

  return (
    <Stack gap={6}>
      {/* Staff */}
      <FormField
        control={control}
        name="staffId"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Kỹ thuật viên</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn kỹ thuật viên" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {availableStaff.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: s.color || "#8b5cf6" }}
                      />
                      {s.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Resources */}
      <FormField
        control={control}
        name="resourceId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Giường</FormLabel>
            <Select
              value={field.value || ""}
              onValueChange={(value) => field.onChange(value || undefined)}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giường (không bắt buộc)" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {availableResources.map((resource) => (
                  <SelectItem key={resource.id} value={resource.id}>
                    {resource.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </Stack>
  );
}
