"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui";
import { Combobox } from "@/shared/ui/custom/combobox";
import { useCustomerSearch } from "@/features/appointments/hooks";
import type { QuickAppointmentFormValues } from "@/features/appointments/model/schemas";

interface CustomerPickerProps {
  placeholder?: string;
  isSearching: boolean;
  customerOptions: Array<{ id: string; name: string; phone: string }>;
  onSearch: (query: string) => void;
}

export function CustomerPicker({
  placeholder,
  isSearching,
  customerOptions,
  onSearch,
}: CustomerPickerProps) {
  const { control } = useFormContext<QuickAppointmentFormValues>();

  return (
    <FormField
      control={control}
      name="customerId"
      render={({ field }) => (
        <FormItem>
          <FormLabel required>Khách hàng</FormLabel>
          <FormControl>
            <Combobox
              options={customerOptions.map((c) => ({
                value: c.id,
                label: c.name,
                description: c.phone,
              }))}
              value={field.value}
              onChange={field.onChange}
              onSearch={onSearch}
              placeholder={placeholder || "Tìm khách hàng..."}
              searchPlaceholder="Nhập tên hoặc SĐT..."
              emptyMessage="Nhập 2 ký tự để tìm..."
              isLoading={isSearching}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
