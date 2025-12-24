"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/shared/ui";
import { DurationPicker } from "@/shared/ui/custom/duration-picker";
import { ServiceTimeVisualizer } from "../service-time-visualizer";

interface ServiceTimePriceInfoProps {
  duration: number;
  bufferTime: number;
}

export function ServiceTimePriceInfo({
  duration,
  bufferTime,
}: ServiceTimePriceInfoProps) {
  const form = useFormContext();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thời lượng</FormLabel>
              <FormControl>
                <DurationPicker
                  value={field.value}
                  onChange={field.onChange}
                  min={15}
                  step={15}
                  className=""
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="buffer_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nghỉ giữa ca</FormLabel>
              <FormControl>
                <DurationPicker
                  value={field.value}
                  onChange={field.onChange}
                  min={0}
                  step={15}
                  className=""
                  iconClassName="text-muted-foreground"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <ServiceTimeVisualizer
        duration={duration}
        bufferTime={bufferTime}
        className="bg-muted/20 border-primary/20 rounded-xl border-2 border-dashed p-4"
      />

      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Giá niêm yết</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={0}
                value={field.value ?? ""}
                onChange={(e) => {
                  const val = e.target.valueAsNumber;
                  field.onChange(isNaN(val) ? 0 : val);
                }}
                onBlur={() => {
                  if (field.value < 0) field.onChange(0);
                }}
                endContent={
                  <div className="text-muted-foreground bg-muted/50 flex h-full items-center justify-center border-l px-3 text-sm font-medium">
                    VNĐ
                  </div>
                }
                className=""
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
