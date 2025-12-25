"use client";

import { Tags } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { cn } from "@/shared/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TagInput,
  Textarea,
} from "@/shared/ui";
import { NumberInput } from "@/shared/ui/custom/number-input";
import { Icon } from "@/shared/ui/custom/icon";

import { ResourceGroup } from "../model/types";

interface ResourceFormProps {
  mode: "create" | "update";
  groups: ResourceGroup[];
  className?: string;
}

export function ResourceForm({ mode, groups, className }: ResourceFormProps) {
  const form = useFormContext();
  const groupId = form.watch("groupId");

  const selectedGroup = groups.find((g) => g.id === groupId);
  const resourceType = selectedGroup?.type;

  if (mode === "create") {
    return (
      <div className={cn("w-full space-y-6 pt-2", className)}>
        <div>
          <h3 className="mb-4 text-base font-semibold">Thông tin chung</h3>
          {renderGeneralInfo()}
        </div>

        <div className="border-t pt-4">
          <h3 className="mb-4 text-base font-semibold">Cấu hình vận hành</h3>
          {renderConfigInfo()}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">Thông tin chung</TabsTrigger>
          <TabsTrigger value="config">Cấu hình vận hành</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="mt-4 border-none p-0">
          {renderGeneralInfo()}
        </TabsContent>
        <TabsContent value="config" className="mt-4 border-none p-0">
          {renderConfigInfo()}
        </TabsContent>
      </Tabs>
    </div>
  );

  function renderGeneralInfo() {
    return (
      <div className="space-y-6">
        {/* Image Upload Pattern matching StaffForm */}

        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Tên tài nguyên</FormLabel>
                <FormControl>
                  <Input placeholder="Ví dụ: Giường VIP 1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Mã định danh</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: B-VIP-01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="groupId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Nhóm tài nguyên</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);
                      const group = groups.find((g) => g.id === val);
                      if (group) form.setValue("type", group.type);
                    }}
                    defaultValue={field.value}
                    disabled={mode === "update"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn phân loại" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {groups.map((g) => (
                        <SelectItem key={g.id} value={g.id}>
                          {g.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả chi tiết</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Mô tả về đặc điểm, vị trí hoặc công dụng..."
                    className="min-h-[100px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    );
  }

  function renderConfigInfo() {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Trạng thái hiện tại</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                    <SelectItem value="MAINTENANCE">Đang bảo trì</SelectItem>
                    <SelectItem value="INACTIVE">Ngưng hoạt động</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="setupTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thời gian Setup (phút)</FormLabel>
                <FormControl>
                  <NumberInput placeholder="0" {...field} suffix="phút" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {resourceType === "BED" && (
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sức chứa tối đa (người)</FormLabel>
                  <FormControl>
                    <NumberInput min={1} placeholder="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {resourceType === "EQUIPMENT" && (
          <div>
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thẻ quản lý (Tags)</FormLabel>
                  <FormControl>
                    <TagInput
                      options={[]}
                      selectedIds={[]}
                      newTags={field.value || []}
                      onSelectedChange={() => {}}
                      onNewTagsChange={(tags) => field.onChange(tags)}
                      placeholder="Nhập tên thẻ rồi nhấn Enter..."
                    />
                  </FormControl>
                  <div className="text-muted-foreground mt-2 flex items-center gap-1.5 text-[0.8rem]">
                    <Icon icon={Tags} size="xs" />
                    <span>
                      Nhấn Enter để thêm thẻ mới. Dùng để lọc thiết bị (VD:
                      #may-cong-nghe-cao)
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>
    );
  }
}
