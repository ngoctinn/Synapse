"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { useFormContext } from "react-hook-form";
import { Skill } from "../../model/types";
import { Checkbox } from "@/shared/ui/checkbox";
import { ScrollArea } from "@/shared/ui/scroll-area";

interface SkillsTabProps {
  availableSkills: Skill[];
}

export function SkillsTab({ availableSkills }: SkillsTabProps) {
  const form = useFormContext();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Yêu cầu kỹ năng</h3>
        <p className="text-muted-foreground text-sm">
           Chọn các kỹ năng nhân viên cần có để thực hiện dịch vụ này.
        </p>
      </div>

      <FormField
        control={form.control}
        name="skill_ids"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel className="text-base">Kỹ năng</FormLabel>
            </div>
            <ScrollArea className="h-[300px] rounded-md border p-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {availableSkills.map((skill) => (
                  <FormField
                    key={skill.id}
                    control={form.control}
                    name="skill_ids"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={skill.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(skill.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), skill.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value: string) => value !== skill.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            {skill.name}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
            </ScrollArea>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
