"use client";

import { Service } from "@/features/services";
import { cn } from "@/shared/lib/utils";
import {
    Button,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    RequiredMark,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Switch,
    Textarea,
} from "@/shared/ui";
import { NumberInput } from "@/shared/ui/custom/number-input";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { PackageFormValues } from "../model/schemas";

interface PackageFormProps {
  mode: "create" | "update";
  availableServices: Service[];
  className?: string;
}

export function PackageForm({ mode, availableServices, className }: PackageFormProps) {
  const form = useFormContext<PackageFormValues>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "services",
  });

  return (
    <div className={cn("space-y-6 p-6", className)}>

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
                className="min-h-20 resize-none"
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
                <NumberInput min={0} placeholder="0" {...field} suffix="VNĐ" />
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
                <NumberInput min={1} placeholder="30" {...field} suffix="ngày" />
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
          <div className="text-muted-foreground rounded-lg border border-dashed py-4 text-center text-sm">
            Chưa có dịch vụ nào. Nhấn &quot;Thêm dịch vụ&quot; để bắt đầu.
          </div>
        )}

        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <FormField
              control={form.control}
              name={`services.${index}.service_id`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn dịch vụ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableServices.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <NumberInput min={1} placeholder="SL" {...field} />
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
              <p className="text-muted-foreground text-xs">
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
