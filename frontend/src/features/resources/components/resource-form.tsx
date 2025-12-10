"use client";

import { Activity, Barcode, Box, Clock, Tags, Type, Users } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { cn } from "@/shared/lib/utils";
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

import { ResourceGroup } from "../types";

interface ResourceFormProps {
    mode: "create" | "update";
    groups: ResourceGroup[];
    className?: string;
}

export function ResourceForm({ mode, groups, className }: ResourceFormProps) {
  const form = useFormContext();
  const groupId = form.watch("groupId");

  const selectedGroup = groups.find(g => g.id === groupId);
  const resourceType = selectedGroup?.type;

  return (
    <div className={cn("space-y-8 w-full max-w-2xl mx-auto", className)}>

        {/* Section 1: Thông tin chung */}
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Box className="w-5 h-5 text-primary" />
                    Thông tin chung
                </h3>
            </div>

            {/* Image Upload */}
            <div className="flex items-center gap-6 p-6 rounded-xl border-2 border-dashed bg-muted/5 hover:bg-muted/10 transition-colors cursor-not-allowed opacity-80">
                <div className="size-20 rounded-xl bg-background flex items-center justify-center border shadow-sm">
                    {mode === 'update' ? (
                        <Box className="size-10 text-muted-foreground" />
                    ) : (
                        <Box className="size-10 text-muted-foreground/50" />
                    )}
                </div>
                <div className="space-y-1">
                    <p className="font-medium">Hình ảnh tài nguyên</p>
                    <p className="text-sm text-muted-foreground">Tính năng đang phát triển</p>
                </div>
            </div>

            <div className="grid gap-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tên tài nguyên <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                        <InputWithIcon
                            icon={Type}
                            placeholder="Ví dụ: Phòng VIP 1"
                            {...field}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mã định danh <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                            <InputWithIcon
                                icon={Barcode}
                                placeholder="Ví dụ: R-VIP-01"
                                {...field}
                            />
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
                            <FormLabel>Nhóm tài nguyên <span className="text-destructive">*</span></FormLabel>
                            <SelectWithIcon
                                onValueChange={(val) => {
                                    field.onChange(val);
                                     const group = groups.find(g => g.id === val);
                                     if (group) form.setValue("type", group.type);
                                }}
                                defaultValue={field.value}
                                icon={Box}
                                placeholder="Chọn phân loại"
                                options={groups.map(g => ({
                                    label: g.name,
                                    value: g.id
                                }))}
                                disabled={mode === "update"}
                            />
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


        {/* Section 2: Cấu hình Vận hành */}
        <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Cấu hình vận hành
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Trạng thái hiện tại <span className="text-destructive">*</span></FormLabel>
                        <SelectWithIcon
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        icon={Activity}
                        placeholder="Chọn trạng thái"
                        options={[
                            { label: "Hoạt động", value: "ACTIVE" },
                            { label: "Đang bảo trì", value: "MAINTENANCE" },
                            { label: "Ngưng hoạt động", value: "INACTIVE" },
                        ]}
                        />
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
                        <InputWithIcon
                            icon={Clock}
                            type="number"
                            min={0}
                            placeholder="0"
                            {...field}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                {resourceType === "ROOM" && (
                     <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <FormField
                        control={form.control}
                        name="capacity"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Sức chứa tối đa (người)</FormLabel>
                            <FormControl>
                            <InputWithIcon
                                icon={Users}
                                type="number"
                                min={1}
                                placeholder="1"
                                {...field}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </div>
                )}
            </div>

            {resourceType === "EQUIPMENT" && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
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
                                        placeholder="Nhập thẻ và nhấn Enter..."
                                    />
                                </FormControl>
                                <div className="text-[0.8rem] text-muted-foreground mt-2 flex items-center gap-1.5">
                                    <Tags className="size-3.5" />
                                    <span>Dùng để lọc thiết bị nhanh chóng (VD: #may-cong-nghe-cao, #hang-moi...)</span>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            )}
        </div>
    </div>
  );
}
