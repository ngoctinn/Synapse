"use client";

import { Skill } from "@/features/services";
import { cn } from "@/shared/lib/utils";
import {
  FormControl,
  FormDescription,
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
  TagInput,
  showToast,
} from "@/shared/ui";
import { Grid, Group, Stack } from "@/shared/ui/layout";
import { Briefcase, Check } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

interface StaffProfessionalInfoProps {
  mode: "create" | "update";
  skills: Skill[];
}

const COLOR_PRESETS = [
  "#3B82F6", "#EF4444", "#10B981", "#F59E0B",
  "#8B5CF6", "#EC4899", "#6366F1", "#14B8A6",
];

export function StaffProfessionalInfo({ mode, skills }: StaffProfessionalInfoProps) {
  const form = useFormContext();
  const control = form.control;
  const role = useWatch({ control, name: "role" });

  return (
    <Stack gap={4}>

      <Grid gap={4} className="grid-cols-1 md:grid-cols-2">
        <FormField
          control={control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vai trò</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={mode === "update"}
              >
                <SelectTrigger startContent={<Briefcase className="size-4" />}>
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manager">Quản lý</SelectItem>
                  <SelectItem value="receptionist">Lễ tân</SelectItem>
                  <SelectItem value="technician">Kỹ thuật viên</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chức danh</FormLabel>
              <FormControl>
                <Input
                  startContent={<Briefcase className="size-4" />}
                  placeholder="VD: Senior Tech"
                  {...field}
                  className="bg-background"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Grid>

      <FormField
        control={control}
        name="color_code"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Màu hiển thị (Lịch)</FormLabel>
            <Group wrap gap={3} className="bg-background/50 rounded-lg border p-3">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => field.onChange(color)}
                  className={cn(
                    "focus-premium relative flex size-8 items-center justify-center rounded-full transition-all",
                    field.value === color
                      ? "ring-primary scale-110 shadow-sm ring-[1.5px] ring-offset-2"
                      : "opacity-80 hover:scale-110 hover:opacity-100 hover:shadow-sm"
                  )}
                  style={{ backgroundColor: color }}
                >
                  {field.value === color && (
                    <Check className="h-4 w-4 text-white drop-shadow-md" strokeWidth={3} />
                  )}
                </button>
              ))}
            </Group>
            <FormDescription>Được dùng để định danh trên lịch hẹn</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {role === "technician" && (
        <Stack gap={3} className="animate-in-top pt-2">
          <FormLabel className="text-sm font-medium px-1">Kỹ năng chuyên môn</FormLabel>
          <FormField
            control={control}
            name="skill_ids"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-0">
                <FormControl>
                  <TagInput
                    options={skills.map((s: Skill) => ({ id: s.id, label: s.name }))}
                    selectedIds={field.value || []}
                    newTags={[]}
                    onSelectedChange={field.onChange}
                    onNewTagsChange={() => showToast.info("Vui lòng tạo kỹ năng tại trang 'Quản lý dịch vụ'")}
                    placeholder="Chọn kỹ năng..."
                    isError={fieldState.invalid}
                    className="bg-background min-h-9 text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Stack>
      )}
    </Stack>
  );
}
