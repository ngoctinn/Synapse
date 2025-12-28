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
        <ScrollArea className="h-[300px] rounded-md border p-4">
          <Grid gap={4} cols={1} className="sm:grid-cols-2">
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
        </ScrollArea>
        <FormMessage />
      </FormItem>
    </Stack>
  );
}
