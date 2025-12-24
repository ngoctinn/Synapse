"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Briefcase, Settings2, Check } from "lucide-react";
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
  Button,
  TagInput,
  showToast,
} from "@/shared/ui";
import { cn } from "@/shared/lib/utils";
import { Skill } from "@/features/services";
import { SkillManagerDialog } from "@/features/services/components/skill-manager/skill-manager-dialog";
import { useState } from "react";

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

  const [availableSkills, setAvailableSkills] = useState<Skill[]>(skills);
  const [isSkillManagerOpen, setSkillManagerOpen] = useState(false);

  return (
    <div className="space-y-4">
      <SkillManagerDialog
        open={isSkillManagerOpen}
        onOpenChange={setSkillManagerOpen}
        onSkillsChange={setAvailableSkills}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                  <SelectItem value="admin">Quản trị viên</SelectItem>
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
      </div>

      <FormField
        control={control}
        name="color_code"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Màu hiển thị (Lịch)</FormLabel>
            <div className="bg-background/50 flex flex-wrap gap-3 rounded-lg border p-3">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => field.onChange(color)}
                  className={cn(
                    "focus-premium relative flex size-8 items-center justify-center rounded-full transition-all",
                    field.value === color
                      ? "ring-primary scale-110 shadow-sm ring-2 ring-offset-2"
                      : "opacity-80 hover:scale-110 hover:opacity-100 hover:shadow-sm"
                  )}
                  style={{ backgroundColor: color }}
                >
                  {field.value === color && (
                    <Check className="h-4 w-4 text-white drop-shadow-md" strokeWidth={3} />
                  )}
                </button>
              ))}
            </div>
            <FormDescription>Được dùng để định danh trên lịch hẹn</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {role === "technician" && (
        <div className="animate-in-top space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <FormLabel className="text-sm font-medium">Kỹ năng chuyên môn</FormLabel>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary h-6 gap-1 px-2 text-xs"
              onClick={() => setSkillManagerOpen(true)}
            >
              <Settings2 className="h-3 w-3" /> Quản lý kỹ năng
            </Button>
          </div>
          <FormField
            control={control}
            name="skill_ids"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-0">
                <FormControl>
                  <TagInput
                    options={availableSkills.map((s) => ({ id: s.id, label: s.name }))}
                    selectedIds={field.value || []}
                    newTags={[]}
                    onSelectedChange={field.onChange}
                    onNewTagsChange={() => showToast.info("Vui lòng dùng nút 'Quản lý kỹ năng' để thêm mới")}
                    placeholder="Chọn kỹ năng..."
                    isError={fieldState.invalid}
                    className="bg-background min-h-[40px] text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}
