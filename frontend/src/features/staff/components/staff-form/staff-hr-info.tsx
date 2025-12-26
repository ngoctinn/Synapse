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
  Button,
  Calendar,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/shared/ui";
import { cn } from "@/shared/lib/utils";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal bg-background",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? (
                      format(parse(field.value, "yyyy-MM-dd", new Date()), "dd/MM/yyyy")
                    ) : (
                      <span>Chọn ngày</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      field.value
                        ? parse(field.value, "yyyy-MM-dd", new Date())
                        : undefined
                    }
                    onSelect={(date) =>
                      field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                    }
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
