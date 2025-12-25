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

      <FormField
        control={form.control}
        name="resource_requirements.bed_type_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Loại giường yêu cầu</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="bg-background w-full">
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
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <FormLabel className="text-sm font-medium">Kỹ năng yêu cầu</FormLabel>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary h-6 gap-1 text-xs"
            onClick={() => setSkillManagerOpen(true)}
          >
            <Settings2 className="h-3 w-3" /> Quản lý kỹ năng
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
                  selectedIds={field.value}
                  newTags={[]}
                  onSelectedChange={field.onChange}
                  onNewTagsChange={() =>
                    showToast.info(
                      "Vui lòng dùng nút 'Quản lý kỹ năng' để thêm mới"
                    )
                  }
                  placeholder="Chọn kỹ năng..."
                  className="bg-background text-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-3 border-t pt-2">
        <FormLabel>Thiết bị & Timeline</FormLabel>
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
