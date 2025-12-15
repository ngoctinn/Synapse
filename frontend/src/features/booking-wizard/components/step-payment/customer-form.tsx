"use client";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Textarea,
} from "@/shared/ui";
import { UseFormReturn } from "react-hook-form";
import { CustomerInfoSchema } from "../../schemas";

interface CustomerFormProps {
  form: UseFormReturn<CustomerInfoSchema>;
}

export const CustomerForm = ({ form }: CustomerFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Thông tin khách hàng</h3>

      <FormField
        control={form.control}
        name="full_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Họ và tên *</FormLabel>
            <FormControl>
              <Input placeholder="Nguyễn Văn A" autoFocus {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số điện thoại *</FormLabel>
              <FormControl>
                <Input placeholder="0912345678" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email (Tùy chọn)</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ghi chú cho Spa</FormLabel>
            <FormControl>
              <Textarea placeholder="Ví dụ: Da nhạy cảm, dị ứng..." className="resize-none" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
