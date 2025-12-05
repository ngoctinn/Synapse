"use client";

import { Resource, RoomType } from "@/features/resources/model/types";
import { Button } from "@/shared/ui/button";
import { DurationPicker } from "@/shared/ui/custom/duration-picker";
import { InputWithIcon } from "@/shared/ui/custom/input-with-icon";
import { MoneyInput } from "@/shared/ui/custom/money-input";
import { TagInput } from "@/shared/ui/custom/tag-input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select";
import { Switch } from "@/shared/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Textarea } from "@/shared/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Clock, Save, Tag } from "lucide-react"; // Import icons
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createService, updateService } from "../actions";
import { ServiceFormValues, serviceSchema } from "../schemas";
import { Service, Skill } from "../types";
import { ImageUpload } from "./image-upload";
import { ServiceTimeVisualizer } from "./service-time-visualizer";

const PRESET_COLORS = [
  "#3b82f6", "#ef4444", "#10b981", "#f59e0b",
  "#8b5cf6", "#ec4899", "#06b6d4", "#f97316"
];

interface ServiceFormProps {
  initialData?: Service;
  availableSkills: Skill[];
  availableRoomTypes: RoomType[];
  availableEquipment: Resource[];
  onSuccess?: () => void;
}

export function ServiceForm({
  initialData,
  availableSkills,
  availableRoomTypes,
  availableEquipment,
  onSuccess
}: ServiceFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema) as Resolver<ServiceFormValues>,
    mode: "onChange",
    defaultValues: {
      name: initialData?.name || "",
      duration: initialData?.duration || 60,
      buffer_time: initialData?.buffer_time || 15,
      price: initialData?.price || 0,
      is_active: initialData?.is_active ?? true,
      image_url: initialData?.image_url || "",
      color: initialData?.color || "#3b82f6",
      description: initialData?.description || "",
      resource_requirements: initialData?.resource_requirements || {
        room_type_id: undefined,
        equipment_ids: []
      },
      skill_ids: initialData?.skills.map((s) => s.id) || [],
      new_skills: [],
    },
  });

  const duration = form.watch("duration");
  const bufferTime = form.watch("buffer_time");

  // Chuyển đổi availableSkills cho TagInput
  const skillOptions = availableSkills.map(s => ({ id: s.id, label: s.name }));

  // Chuyển đổi availableEquipment cho TagInput
  const equipmentOptions = availableEquipment.map(e => ({ id: e.id, label: e.name }));

  async function onSubmit(data: ServiceFormValues) {
    startTransition(async () => {
      try {
        const result = initialData
          ? await updateService(initialData.id, data)
          : await createService(data);

        if (result.success) {
          toast.success(
            initialData ? "Cập nhật dịch vụ thành công" : "Tạo dịch vụ thành công"
          );
          if (onSuccess) {
            onSuccess();
          } else {
            router.push("/admin/services");
          }
          router.refresh();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Đã có lỗi xảy ra");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* Top Actions Bar */}
        <div className="flex items-center justify-between bg-background/50 backdrop-blur pb-4 border-b sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" type="button" onClick={() => router.back()} className="rounded-full">
                    <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                </Button>
                <div></div>
            </div>
            <div className="flex items-center gap-3">
                 <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0 mr-4">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-primary"
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer font-normal text-sm">
                        {field.value ? "Hoạt động" : "Tạm ẩn"}
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <Button variant="outline" type="button" onClick={() => router.back()} disabled={isPending}>
                    Hủy
                </Button>
                <Button type="submit" disabled={isPending} className="min-w-[120px] shadow-md shadow-primary/20">
                    {isPending ? <span className="animate-spin mr-2">⏳</span> : <Save className="w-4 h-4 mr-2" />}
                    {initialData ? "Lưu thay đổi" : "Tạo dịch vụ"}
                </Button>
            </div>
        </div>

        <Tabs defaultValue="general" className="w-full space-y-6">
            <TabsList className="w-full justify-start h-12 p-1 bg-muted/40 rounded-xl">
                 <TabsTrigger value="general" className="rounded-lg h-full px-8 text-sm data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300">
                    Thông tin hiển thị
                 </TabsTrigger>
                 <TabsTrigger value="settings" className="rounded-lg h-full px-8 text-sm data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300">
                    Thiết lập & Tài nguyên
                 </TabsTrigger>
            </TabsList>

             {/* TAB 1: THÔNG TIN CHUNG */}
            <TabsContent value="general" className="animate-fade-in space-y-8">
                <div className="grid lg:grid-cols-3 gap-8">
                     {/* Cột trái: Ảnh đại diện */}
                     <div className="lg:col-span-1 space-y-6">
                        <div className="flex flex-col gap-4">
                            <h3 className="font-medium text-foreground flex items-center gap-2">
                                <span className="w-1 h-5 bg-primary rounded-full"></span>
                                Ảnh đại diện
                            </h3>
                            <FormField
                                control={form.control}
                                name="image_url"
                                render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                    <ImageUpload
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={isPending}
                                    />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <p className="text-xs text-muted-foreground text-center px-4">
                                Ảnh nên có tỉ lệ 1:1 hoặc 4:3, chất lượng cao để hiển thị tốt nhất trên ứng dụng khách hàng.
                            </p>
                        </div>
                     </div>

                     {/* Cột phải: Form fields */}
                     <div className="lg:col-span-2 grid gap-6 content-start bg-card/50 p-6 rounded-2xl border shadow-sm">
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                <FormLabel className="text-foreground/80">Tên dịch vụ <span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                    <InputWithIcon icon={Tag} placeholder="VD: Massage Body Thụy Điển" className="h-11 rounded-lg bg-background" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />

                            <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="text-foreground/80">Giá niêm yết <span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                    <MoneyInput
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="0"
                                    className="h-11 rounded-lg bg-background"
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />

                            <FormField
                                control={form.control}
                                name="color"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground/80">Màu hiển thị (trên lịch)</FormLabel>
                                    <FormControl>
                                    <div className="flex items-center gap-2 bg-background p-1.5 rounded-lg border h-11 w-fit">
                                        <div className="relative group">
                                            <input
                                                type="color"
                                                className="w-7 h-7 p-0 border-0 rounded-full overflow-hidden cursor-pointer opacity-0 absolute inset-0 z-10"
                                                {...field}
                                            />
                                            <div
                                                className="w-7 h-7 rounded-full border shadow-sm ring-1 ring-border/20 transition-transform group-hover:scale-110"
                                                style={{ backgroundColor: field.value }}
                                            />
                                        </div>
                                        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1 px-1">
                                        {PRESET_COLORS.map((color) => (
                                            <button
                                            key={color}
                                            type="button"
                                            className={`w-5 h-5 rounded-full border transition-all flex-shrink-0 ${
                                                field.value === color
                                                ? "ring-2 ring-primary ring-offset-1 scale-110"
                                                : "hover:scale-110 hover:shadow-sm"
                                            }`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => field.onChange(color)}
                                            />
                                        ))}
                                        </div>
                                    </div>
                                    </FormControl>
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
                                <FormLabel className="text-foreground/80">Mô tả dịch vụ</FormLabel>
                                <FormControl>
                                <Textarea
                                    placeholder="Mô tả chi tiết về quy trình, lợi ích (Hiển thị trên app khách hàng)..."
                                    className="min-h-[120px] rounded-lg bg-background resize-none"
                                    {...field}
                                    value={field.value || ""}
                                />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                     </div>
                </div>
            </TabsContent>

            {/* TAB 2: CẤU HÌNH & TÀI NGUYÊN */}
            <TabsContent value="settings" className="animate-fade-in">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Block: Thời gian */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b">
                            <Clock className="w-5 h-5 text-primary" />
                            <h3 className="font-serif font-medium text-lg">Cấu hình Thời gian</h3>
                        </div>

                        <div className="bg-card/50 p-6 rounded-2xl border shadow-sm space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="duration"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground/80">Thời lượng (phút)</FormLabel>
                                        <FormControl>
                                        <DurationPicker
                                            value={field.value}
                                            onChange={field.onChange}
                                            min={15}
                                            step={15}
                                            className="h-11 rounded-lg bg-background"
                                        />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="buffer_time"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground/80">Nghỉ giữa ca (phút)</FormLabel>
                                        <FormControl>
                                        <DurationPicker
                                            value={field.value}
                                            onChange={field.onChange}
                                            min={0}
                                            step={15}
                                            className="h-11 rounded-lg bg-background"
                                        />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>

                            {/* Visualizer */}
                            <ServiceTimeVisualizer duration={duration} bufferTime={bufferTime} className="bg-muted/20 border-2 border-dashed border-primary/20 rounded-xl p-5" />
                        </div>
                    </div>

                    {/* Block: Tài nguyên */}
                    <div className="space-y-6">
                         <div className="flex items-center gap-2 pb-2 border-b">
                            <Tag className="w-5 h-5 text-primary" />
                            <h3 className="font-serif font-medium text-lg">Yêu cầu Tài nguyên</h3>
                        </div>

                         <div className="bg-card/50 p-6 rounded-2xl border shadow-sm space-y-6">
                             {/* Room Type */}
                             <FormField
                                control={form.control}
                                name="resource_requirements.room_type_id"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground/80">Loại phòng yêu cầu</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-11 rounded-lg bg-background">
                                        <SelectValue placeholder="-- Chọn loại phòng --" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {availableRoomTypes.map((type) => (
                                            <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />

                             {/* Skills */}
                             <FormField
                                control={form.control}
                                name="skill_ids"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel className="text-foreground/80">Kỹ năng nhân viên</FormLabel>
                                    <FormControl>
                                        <TagInput
                                        options={skillOptions}
                                        selectedIds={field.value}
                                        newTags={form.watch("new_skills")}
                                        onSelectedChange={field.onChange}
                                        onNewTagsChange={(tags) => form.setValue("new_skills", tags)}
                                        placeholder="Chọn kỹ năng..."
                                        className="min-h-[44px] rounded-lg bg-background"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />

                             {/* Equipment */}
                             <FormField
                                control={form.control}
                                name="resource_requirements.equipment_ids"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground/80">Thiết bị bắt buộc</FormLabel>
                                    <FormControl>
                                        <TagInput
                                            options={equipmentOptions}
                                            selectedIds={field.value}
                                            newTags={[]}
                                            onSelectedChange={field.onChange}
                                            onNewTagsChange={() => {}}
                                            placeholder="Chọn thiết bị..."
                                            className="min-h-[44px] rounded-lg bg-background"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                         </div>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}
