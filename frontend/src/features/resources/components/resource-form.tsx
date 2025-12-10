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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
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

  const GeneralInfo = () => (
    <div className="space-y-6">
        {/* Image Upload Pattern matching StaffForm */}
        <div className="flex items-start gap-6 p-4 border rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group">
            <div className="relative">
                 <div className="size-20 rounded-xl bg-background flex items-center justify-center border-2 border-dashed border-muted-foreground/30 group-hover:border-primary/50 transition-all shadow-sm overflow-hidden">
                     {mode === 'update' ? (
                         <Box className="size-8 text-muted-foreground" />
                     ) : (
                         <div className="text-center">
                             <Box className="size-8 text-muted-foreground/50 mx-auto" />
                         </div>
                     )}
                 </div>
            </div>
            <div className="flex-1 space-y-1">
                 <div className="flex items-center justify-between">
                     <p className="text-sm font-medium text-foreground">Hình ảnh tài nguyên</p>
                     <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">Sắp ra mắt</span>
                 </div>
                 <p className="text-xs text-muted-foreground leading-relaxed">
                     Hỗ trợ định dạng JPG, PNG. Kích thước tối đa 5MB.<br/>
                     Hình ảnh sẽ hiển thị trên lưới lịch đặt phòng/thiết bị.
                 </p>
            </div>
        </div>

        <div className="grid gap-6">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-foreground/80 font-normal">Tên tài nguyên <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                    <InputWithIcon
                        icon={Type}
                        placeholder="Ví dụ: Phòng VIP 1"
                        {...field}
                        className="bg-background h-10"
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
                        <FormLabel className="text-foreground/80 font-normal">Mã định danh <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                        <InputWithIcon
                            icon={Barcode}
                            placeholder="Ví dụ: R-VIP-01"
                            {...field}
                            className="bg-background h-10"
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
                        <FormLabel className="text-foreground/80 font-normal">Nhóm tài nguyên <span className="text-destructive">*</span></FormLabel>
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
                             className="bg-background h-10"
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
                    <FormLabel className="text-foreground/80 font-normal">Mô tả chi tiết</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="Mô tả về đặc điểm, vị trí hoặc công dụng..."
                        className="min-h-[100px] resize-none bg-background"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    </div>
  )

  const ConfigInfo = () => (
    <div className="space-y-6">
         <div className="flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm mb-4 border border-blue-100">
            <Activity className="size-4 shrink-0" />
            <p>Các thiết lập này ảnh hưởng trực tiếp đến việc xếp lịch và tính khả dụng.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-foreground/80 font-normal">Trạng thái hiện tại <span className="text-destructive">*</span></FormLabel>
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
                    className="bg-background h-10"
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
                    <FormLabel className="text-foreground/80 font-normal">Thời gian Setup (phút)</FormLabel>
                    <FormControl>
                    <InputWithIcon
                        icon={Clock}
                        type="number"
                        min={0}
                        placeholder="0"
                        {...field}
                         className="bg-background h-10"
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
                        <FormLabel className="text-foreground/80 font-normal">Sức chứa tối đa (người)</FormLabel>
                        <FormControl>
                        <InputWithIcon
                            icon={Users}
                            type="number"
                            min={1}
                            placeholder="1"
                            {...field}
                             className="bg-background h-10"
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
                            <FormLabel className="text-foreground/80 font-normal">Thẻ quản lý (Tags)</FormLabel>
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
  )

  return (
    <div className={cn("w-full", className)}>
        <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="general">Thông tin chung</TabsTrigger>
                <TabsTrigger value="config">Cấu hình vận hành</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="space-y-4">
                 <GeneralInfo />
            </TabsContent>
            <TabsContent value="config" className="space-y-4">
                 <ConfigInfo />
            </TabsContent>
        </Tabs>
    </div>
  );
}
