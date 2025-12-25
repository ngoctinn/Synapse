"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Settings2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  RequiredMark,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
  TagInput,
  showToast,
} from "@/shared/ui";
import { Resource, BedType } from "@/features/resources";
import { Skill } from "../../model/types";
import { SkillManagerDialog } from "../skill-manager/skill-manager-dialog";
import { EquipmentTimelineEditor } from "../equipment-timeline-editor";

interface ServiceResourcesInfoProps {
  availableBedTypes: BedType[];
  skills: Skill[];
  onSkillsChange: (skills: Skill[]) => void;
  availableEquipment: Resource[];
  duration: number;
}

export function ServiceResourcesInfo({
  availableBedTypes,
  skills,
  onSkillsChange,
  availableEquipment,
  duration,
}: ServiceResourcesInfoProps) {
  const form = useFormContext();
  const [isSkillManagerOpen, setSkillManagerOpen] = useState(false);
  const skillOptions = skills.map((s) => ({ id: s.id, label: s.name }));

  return (
    <div className="space-y-6">
      <SkillManagerDialog
        open={isSkillManagerOpen}
        onOpenChange={setSkillManagerOpen}
        onSkillsChange={onSkillsChange}
      />

      {/* Bed Type Selection */}
      <FormField
        control={form.control}
        name="resource_requirements.bed_type_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              Loại giường <RequiredMark />
            </FormLabel>
            {availableBedTypes.length > 0 ? (
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="h-10 bg-background">
                    <SelectValue placeholder="-- Chọn loại giường --" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableBedTypes.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-xs text-destructive bg-destructive/5 p-3 rounded-lg border border-destructive/20 flex flex-col gap-1">
                <span className="font-semibold">⚠️ Chưa có loại giường</span>
                <span>Vui lòng thêm trong <strong>Quản lý Tài nguyên</strong> trước khi cấu hình dịch vụ.</span>
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Skills Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <FormLabel>Kỹ năng yêu cầu</FormLabel>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary/80 h-auto p-0 text-xs font-semibold underline-offset-4 hover:underline"
            onClick={() => setSkillManagerOpen(true)}
          >
            Quản lý kỹ năng
          </Button>
        </div>
        <FormField
          control={form.control}
          name="skill_ids"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TagInput
                  options={skillOptions}
                  selectedIds={field.value || []}
                  newTags={[]}
                  onSelectedChange={field.onChange}
                  onNewTagsChange={() =>
                    showToast.info(
                      "Vui lòng dùng nút 'Quản lý kỹ năng' để thêm mới"
                    )
                  }
                  placeholder="Chọn kỹ năng mà kỹ thuật viên cần có..."
                  className="bg-background"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Equipment Timeline Editor */}
      <div className="pt-2">
        <FormField
          control={form.control}
          name="resource_requirements.equipment_usage"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <EquipmentTimelineEditor
                  serviceDuration={duration}
                  availableEquipment={availableEquipment.filter(
                    (e) => e.type === "EQUIPMENT"
                  )}
                  value={field.value || []}
                  onChange={field.onChange}
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
