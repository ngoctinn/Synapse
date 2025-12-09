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

  // Sync type to form state for schema consistency (optional but good for debugging)
  // useEffect(() => {
  //   if (resourceType) form.setValue("type", resourceType);
  // }, [resourceType, form]);

  const GeneralInfo = () => (
    <div className="space-y-6">
         {/* Image Placeholder */}
         <div className="flex items-center gap-4 p-4 border rounded-xl bg-muted/10 border-dashed hover:bg-muted/20 transition-colors cursor-pointer group">
            <div className="size-16 rounded-lg bg-background flex items-center justify-center border-2 border-muted group-hover:border-primary/50 transition-colors shadow-sm">
                <Box className="size-8 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-foreground">Hình ảnh tài nguyên</p>
                <p className="text-xs text-muted-foreground group-hover:text-primary/80 transition-colors">
                    Nhấn để tải lên hoặc kéo thả (Chưa hỗ trợ)
                </p>
            </div>
        </div>

        <div className="grid gap-4">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-foreground/80 font-normal">Tên tài nguyên</FormLabel>
                    <FormControl>
                    <InputWithIcon
                        icon={Type}
                        placeholder="Ví dụ: Phòng VIP 1"
                        className="bg-background h-10"
                        {...field}
                    />
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
                    <InputWithIcon
                        icon={Barcode}
                        placeholder="Ví dụ: R-VIP-01"
                        className="bg-background h-10"
                        {...field}
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-foreground/80 font-normal">Mô tả</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="Mô tả chi tiết về tài nguyên này..."
                        className="min-h-[100px] resize-none bg-background focus-visible:ring-primary/20"
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

  const OperationInfo = () => (
    <div className="space-y-6">
        <div className="space-y-4">
            <FormField
                control={form.control}
                name="groupId"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-foreground/80 font-normal">Nhóm tài nguyên</FormLabel>
                    <SelectWithIcon
                        onValueChange={(val) => {
                            field.onChange(val);
                            // Auto-set type for form state consistency if needed by schema
                             const group = groups.find(g => g.id === val);
                             if (group) form.setValue("type", group.type);
                        }}
                        defaultValue={field.value}
                        icon={Box}
                        placeholder="Chọn nhóm tài nguyên"
                        options={groups.map(g => ({
                            label: g.name,
                            value: g.id
                        }))}
                        disabled={mode === "update"} // Usually group doesn't change easily? Or allow it.
                    />
                    <FormMessage />
                </FormItem>
                )}
            />

            <div className="grid grid-cols-2 gap-4">
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

                <FormField
                    control={form.control}
                    name="setupTime"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-foreground/80 font-normal">TG Chuẩn bị (phút)</FormLabel>
                        <FormControl>
                        <InputWithIcon
                            icon={Clock}
                            type="number"
                            min={0}
                            placeholder="0"
                            className="bg-background h-10"
                            {...field}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>

            {resourceType === "ROOM" && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <FormField
                        control={form.control}
                        name="capacity"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-foreground/80 font-normal">Sức chứa (người)</FormLabel>
                            <FormControl>
                            <InputWithIcon
                                icon={Users}
                                type="number"
                                min={1}
                                placeholder="1"
                                className="bg-background h-10"
                                {...field}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
            )}

            {resourceType === "EQUIPMENT" && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-foreground/80 font-normal">
                                    Thẻ quản lý
                                </FormLabel>
                                <FormControl>
                                    <TagInput
                                        options={[]}
                                        selectedIds={field.value || []}
                                        newTags={field.value || []}
                                        onSelectedChange={() => {}}
                                        onNewTagsChange={(tags) => field.onChange(tags)}
                                        placeholder="Nhập thẻ và nhấn Enter..."
                                        className="bg-background"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                        <Tags className="size-3" />
                        Dùng để phân loại và lọc thiết bị nhanh chóng
                    </p>
                </div>
            )}
        </div>
    </div>
  );

  if (mode === "create") {
    return (
        <div className={cn("space-y-8", className)}>
             <GeneralInfo />
             <div className="h-[1px] bg-border/50" />
             <OperationInfo />
        </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
        <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-muted/40 backdrop-blur-sm border rounded-lg">
                <TabsTrigger
                    value="general"
                    className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300"
                >
                    Thông tin chung
                </TabsTrigger>
                <TabsTrigger
                    value="operations"
                    className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300"
                >
                    Cấu hình vận hành
                </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6 mt-0">
                <GeneralInfo />
            </TabsContent>
            <TabsContent value="operations" className="space-y-6 mt-0">
                <OperationInfo />
            </TabsContent>
        </Tabs>
    </div>
  );
}
