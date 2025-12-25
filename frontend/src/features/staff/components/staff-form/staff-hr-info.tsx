"use client";

import { useFormContext } from "react-hook-form";
import { format, parse } from "date-fns";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  DatePicker,
} from "@/shared/ui";
import { NumberInput } from "@/shared/ui/custom/number-input";

export function StaffHRInfo() {
  const form = useFormContext();
  const control = form.control;

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="hired_at"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ngày tuyển dụng</FormLabel>
            <FormControl>
              <DatePicker
                value={field.value ? parse(field.value, "yyyy-MM-dd", new Date()) : undefined}
                onChange={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                placeholder="Chọn ngày"
                className="bg-background"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="commission_rate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hoa hồng (%)</FormLabel>
            <FormControl>
              <NumberInput
                min={0}
                max={100}
                placeholder="0"
                {...field}
                onChange={field.onChange}
                suffix="%"
                className="bg-background"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
