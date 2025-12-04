"use client";

import { Button } from "@/shared/ui/button";
import { InputWithIcon } from "@/shared/ui/custom/input-with-icon";
import { MoneyInput } from "@/shared/ui/custom/money-input";
import { TagInput } from "@/shared/ui/custom/tag-input";
import { DurationPicker } from "@/shared/ui/custom/duration-picker";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/ui/form";
import { Switch } from "@/shared/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tag, Clock, Coffee } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createService, updateService } from "../actions";
import { ServiceFormValues, serviceSchema } from "../schemas";
import { Service, Skill } from "../types";
import { ImageUpload } from "./image-upload";
import { ServiceTimeVisualizer } from "./service-time-visualizer";

interface ServiceFormProps {
  initialData?: Service;
  availableSkills: Skill[];
  onSuccess?: () => void;
}

export function ServiceForm({ initialData, availableSkills, onSuccess }: ServiceFormProps) {
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
      skill_ids: initialData?.skills.map((s) => s.id) || [],
      new_skills: [],
    },
  });

  const duration = form.watch("duration");
  const bufferTime = form.watch("buffer_time");

  // Chuyển đổi availableSkills cho TagInput
  const skillOptions = availableSkills.map(s => ({ id: s.id, label: s.name }));

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
        <div className="grid gap-8 md:grid-cols-2">
          {/* Cột Trái: Thông tin chung */}
          <div className="space-y-6">
            <div className="rounded-lg border p-6 bg-card shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b pb-2">
                <h4 className="font-medium">Thông tin chung</h4>
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3 space-y-0">
                      <FormLabel className={`font-normal text-sm ${field.value ? "text-primary font-medium" : "text-muted-foreground"}`}>
                        {field.value ? "Đang hoạt động" : "Tạm ẩn"}
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                {/* Ảnh dịch vụ (Bên trái) */}
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem className="flex-shrink-0">
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

                {/* Các trường thông tin (Bên phải) */}
                <div className="flex-1 space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên dịch vụ</FormLabel>
                        <FormControl>
                          <InputWithIcon icon={Tag} placeholder="VD: Massage Body Thụy Điển" {...field} />
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
                        <FormLabel>Giá dịch vụ</FormLabel>
                        <FormControl>
                          <MoneyInput
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            {/* Kỹ năng */}
            <div className="rounded-lg border p-6 bg-card shadow-sm space-y-6">
               <h4 className="font-medium flex items-center gap-2 border-b pb-2">
                Yêu cầu kỹ năng
              </h4>
              <FormField
                control={form.control}
                name="skill_ids"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TagInput
                        options={skillOptions}
                        selectedIds={field.value}
                        newTags={form.watch("new_skills")}
                        onSelectedChange={field.onChange}
                        onNewTagsChange={(tags) => form.setValue("new_skills", tags)}
                        placeholder="Chọn hoặc tạo kỹ năng..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Cột Phải: Cấu hình */}
          <div className="space-y-6">
            {/* Cấu hình thời gian */}
            <div className="rounded-lg border p-6 bg-card shadow-sm space-y-6">
              <h4 className="font-medium flex items-center gap-2 border-b pb-2 border-border">
                Cấu hình thời gian
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Thời lượng
                      </FormLabel>
                      <FormControl>
                        <DurationPicker
                          value={field.value}
                          onChange={field.onChange}
                          min={15}
                          step={15}
                          placeholder="Chọn thời lượng"
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
                      <FormLabel className="flex items-center gap-2">
                        Thời gian nghỉ
                      </FormLabel>
                      <FormControl>
                        <DurationPicker
                          value={field.value}
                          onChange={field.onChange}
                          min={0}
                          step={15}
                          placeholder="Chọn thời gian nghỉ"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <ServiceTimeVisualizer duration={duration} bufferTime={bufferTime} />
            </div>


          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
            <Button type="submit" disabled={isPending}>
            {isPending ? "Đang lưu..." : (initialData ? "Cập nhật" : "Tạo mới")}
            </Button>
        </div>
      </form>
    </Form>
  );
}
