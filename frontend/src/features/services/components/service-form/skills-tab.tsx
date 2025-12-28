"use client";

import { Checkbox } from "@/shared/ui/checkbox";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Grid, Stack } from "@/shared/ui/layout";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { AlertTriangle } from "lucide-react";
import { useController, useFormContext } from "react-hook-form";
import { Skill } from "../../model/types";

interface SkillsTabProps {
  availableSkills: Skill[];
}

export function SkillsTab({ availableSkills }: SkillsTabProps) {
  const form = useFormContext();
  const { field } = useController({
    control: form.control,
    name: "skill_ids",
  });

  const hasNoSkills = availableSkills.length === 0;

  return (
    <Stack gap={6}>
      <Stack gap={1}>
        <FormLabel className="text-lg font-semibold">Yêu cầu kỹ năng</FormLabel>
        <div className="text-muted-foreground text-sm">
          Chọn các kỹ năng nhân viên cần có để thực hiện dịch vụ này.
        </div>
      </Stack>

      <FormItem>
        <div className="mb-4">
          <FormLabel className="text-base">Danh sách kỹ năng</FormLabel>
        </div>
        <ScrollArea className="h-72 rounded-md border p-4">
          {hasNoSkills ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <div className="bg-warning/10 rounded-full p-3">
                <AlertTriangle className="text-warning size-6" />
              </div>
              <div className="space-y-1">
                <p className="text-foreground font-medium">
                  Chưa có kỹ năng nào
                </p>
                <p className="text-muted-foreground text-sm">
                  Vui lòng tạo kỹ năng tại tab &quot;Kỹ năng&quot; trước khi tạo
                  dịch vụ.
                </p>
              </div>
            </div>
          ) : (
            <Grid gap={4} className="grid-cols-1 sm:grid-cols-2">
              {availableSkills.map((skill) => (
                <FormItem
                  key={skill.id}
                  className="flex flex-row items-center space-x-3 space-y-0"
                >
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(skill.id)}
                      onCheckedChange={(checked) => {
                        const current = field.value || [];
                        const updated = checked
                          ? [...current, skill.id]
                          : current.filter((id: string) => id !== skill.id);
                        field.onChange(updated);
                      }}
                    />
                  </FormControl>
                  <FormLabel className="cursor-pointer font-normal">
                    {skill.name}
                  </FormLabel>
                </FormItem>
              ))}
            </Grid>
          )}
        </ScrollArea>
        <FormMessage />
      </FormItem>
    </Stack>
  );
}
