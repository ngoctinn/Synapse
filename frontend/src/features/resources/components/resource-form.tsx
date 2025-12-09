"use client";

import { Activity, Box, Code2, Users } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { InputWithIcon } from "@/shared/ui/custom/input-with-icon";
import { SelectWithIcon } from "@/shared/ui/custom/select-with-icon";
import { TagInput } from "@/shared/ui/custom/tag-input";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/shared/ui/form";
import { Textarea } from "@/shared/ui/textarea";

export function ResourceForm() {
  const form = useFormContext();
  const resourceType = form.watch("type");

  return (
    <>
        {/* Image Placeholder */}
        <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/20">
            <div className="size-16 rounded-lg bg-muted flex items-center justify-center border-2 border-background shadow-sm">
                <Box className="size-8 text-muted-foreground" />
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium">Hình ảnh tài nguyên</p>
                <p className="text-xs text-muted-foreground">Chạm vào để thay đổi (Chưa hỗ trợ)</p>
            </div>
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/80 font-normal">Tên tài nguyên</FormLabel>
                <FormControl>
                  <InputWithIcon icon={Box} placeholder="Ví dụ: Phòng VIP 1" className="bg-background" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/80 font-normal">Mã tài nguyên</FormLabel>
                <FormControl>
                  <InputWithIcon icon={Code2} placeholder="Ví dụ: R-VIP-01" className="bg-background" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/80 font-normal">Loại</FormLabel>
                <SelectWithIcon
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  icon={Box}
                  placeholder="Chọn loại tài nguyên"
                  options={[
                    { label: "Phòng", value: "ROOM" },
                    { label: "Thiết bị", value: "EQUIPMENT" },
                  ]}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/80 font-normal">Trạng thái</FormLabel>
                <SelectWithIcon
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  icon={Activity}
                  placeholder="Chọn trạng thái"
                  options={[
                    { label: "Hoạt động", value: "ACTIVE" },
                    { label: "Bảo trì", value: "MAINTENANCE" },
                    { label: "Ngưng hoạt động", value: "INACTIVE" },
                  ]}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

          <FormField
            control={form.control}
            name="setupTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/80 font-normal">Thời gian chuẩn bị (phút)</FormLabel>
                <FormControl>
                  <InputWithIcon icon={Box} type="number" min={0} placeholder="0" className="bg-background" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        {resourceType === "ROOM" && (
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/80 font-normal">Sức chứa (người)</FormLabel>
                <FormControl>
                  <InputWithIcon icon={Users} type="number" min={1} placeholder="1" className="bg-background" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {resourceType === "EQUIPMENT" && (
             <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-foreground/80 font-normal">Thẻ / Nhãn</FormLabel>
                        <FormControl>
                            <TagInput
                                options={[]} // Assuming no preset options for now
                                selectedIds={field.value || []}
                                newTags={field.value || []}
                                onSelectedChange={() => {}} // No ID selection implemented for simple text tags
                                onNewTagsChange={(tags) => field.onChange(tags)}
                                placeholder="Nhập thẻ..."
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        )}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground/80 font-normal">Mô tả</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Mô tả chi tiết về tài nguyên này..."
                  className="min-h-[100px] resize-none bg-background"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
    </>
  );
}
