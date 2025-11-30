"use client";

import { Button } from "@/shared/ui/button";
import { InputWithIcon } from "@/shared/ui/custom/input-with-icon";
import { MoneyInput } from "@/shared/ui/custom/money-input";
import { TagInput } from "@/shared/ui/custom/tag-input";
import { TimePicker } from "@/shared/ui/custom/time-picker";
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
import { Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createService, updateService } from "../actions";
import { ServiceFormValues, serviceSchema } from "../schemas";
import { Service, Skill } from "../types";

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
      skill_ids: initialData?.skills.map((s) => s.id) || [],
      new_skills: [],
    },
  });

  const duration = form.watch("duration");
  const bufferTime = form.watch("buffer_time");

  // Transform availableSkills for TagInput
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
        <div className="grid gap-8 md:grid-cols-12">
          {/* Left Column: Main Inputs (Span 7) */}
          <div className="md:col-span-7 space-y-6">
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời lượng</FormLabel>
                    <FormControl>
                      <TimePicker
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
                    <FormLabel>Thời gian nghỉ</FormLabel>
                    <FormControl>
                      <TimePicker
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

            <div className="grid grid-cols-2 gap-4">
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

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái</FormLabel>
                    <div className="flex items-center justify-between rounded-md border p-3 shadow-sm h-10 bg-white">
                      <span className="text-sm font-medium text-slate-700">
                        {field.value ? "Đang hoạt động" : "Tạm ẩn"}
                      </span>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="scale-75 origin-right"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Right Column: Context & Skills (Span 5) */}
          <div className="md:col-span-5 space-y-6">
            {/* Visualization */}
            <div className="rounded-lg border p-4 bg-slate-50">
              <h4 className="text-sm font-medium mb-2">Trực quan hóa thời gian</h4>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span className="w-3 h-3 bg-blue-500 rounded-sm"></span> Phục vụ ({duration}p)
                <span className="w-3 h-3 bg-slate-300 rounded-sm pattern-diagonal-lines"></span> Nghỉ ({bufferTime}p)
              </div>
              <div className="h-6 w-full bg-white rounded-full overflow-hidden flex border">
                <div
                  className="h-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold"
                  style={{ width: `${(Number(duration) / (Number(duration) + Number(bufferTime))) * 100}%` }}
                >
                  {duration}p
                </div>
                <div
                  className="h-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-600 font-bold relative"
                  style={{
                    width: `${(Number(bufferTime) / (Number(duration) + Number(bufferTime))) * 100}%`,
                    backgroundImage: "linear-gradient(45deg, #cbd5e1 25%, transparent 25%, transparent 50%, #cbd5e1 50%, #cbd5e1 75%, transparent 75%, transparent)",
                    backgroundSize: "10px 10px"
                  }}
                >
                  {Number(bufferTime) > 0 && `${bufferTime}p`}
                </div>
              </div>
              <p className="text-xs text-right mt-1 font-medium text-slate-700">
                Tổng thời gian khóa lịch: {Number(duration) + Number(bufferTime)} phút
              </p>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <FormLabel>Yêu cầu kỹ năng</FormLabel>
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
