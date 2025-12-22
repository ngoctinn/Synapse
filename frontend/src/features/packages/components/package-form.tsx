"use client";

import { cn } from "@/shared/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  RequiredMark,
  Switch,
  Textarea,
} from "@/shared/ui";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/shared/ui";
import { Plus, Trash2 } from "lucide-react";
import { PackageFormValues } from "../schemas";

interface PackageFormProps {
  mode: "create" | "update";
  className?: string;
}

export function PackageForm({ mode, className }: PackageFormProps) {
  const form = useFormContext<PackageFormValues>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "services",
  });

  return (
    <div className={cn("space-y-6 p-6", className)}>
      {/* Hidden ID for update mode */}
      {mode === "update" && (
        <FormField
          control={form.control}
          name="name"
          render={() => <input type="hidden" />}
        />
      )}

      {/* Tên gói */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Tên gói <RequiredMark />
            </FormLabel>
            <FormControl>
              <Input
                placeholder="VD: Gói Chăm Sóc Da Premium"
                autoFocus={mode === "create"}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Mô tả */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mô tả</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Mô tả chi tiết về gói dịch vụ..."
                className="resize-none min-h-[80px]"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Giá và Thời hạn */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Giá (VNĐ) <RequiredMark />
              </FormLabel>
              <FormControl>
                <Input type="number" min={0} placeholder="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="validity_days"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Hiệu lực (ngày) <RequiredMark />
              </FormLabel>
              <FormControl>
                <Input type="number" min={1} placeholder="30" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Danh sách dịch vụ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <FormLabel>
            Dịch vụ trong gói <RequiredMark />
          </FormLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ service_id: "", quantity: 1 })}
          >
            <Plus className="size-3.5" />
            Thêm dịch vụ
          </Button>
        </div>

        {fields.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
            Chưa có dịch vụ nào. Nhấn &quot;Thêm dịch vụ&quot; để bắt đầu.
          </div>
        )}

        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-start">
            <FormField
              control={form.control}
              name={`services.${index}.service_id`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="ID dịch vụ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`services.${index}.quantity`}
              render={({ field }) => (
                <FormItem className="w-20">
                  <FormControl>
                    <Input type="number" min={1} placeholder="SL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={() => remove(index)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Trạng thái */}
      <FormField
        control={form.control}
        name="is_active"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Kích hoạt gói</FormLabel>
              <p className="text-xs text-muted-foreground">
                Gói đang bán và hiển thị cho khách hàng
              </p>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
