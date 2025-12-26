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
import { Stack, Group, Grid } from "@/shared/ui/layout";

interface SkillsTabProps {
  availableSkills: Skill[];
}

export function SkillsTab({ availableSkills }: SkillsTabProps) {
  const form = useFormContext();

  return (
    <Stack gap={6}>
      <Stack gap={1}>
        <FormLabel className="text-lg">Yêu cầu kỹ năng</FormLabel>
        <div className="text-muted-foreground text-sm">
           Chọn các kỹ năng nhân viên cần có để thực hiện dịch vụ này.
        </div>
      </Stack>

      <FormField
        control={form.control}
        name="skill_ids"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel className="text-base">Kỹ năng</FormLabel>
            </div>
            <ScrollArea className="h-[300px] rounded-md border p-4">
              <Grid gap={4} cols={1} className="sm:grid-cols-2">
                {availableSkills.map((skill) => (
                  <FormField
                    key={skill.id}
                    control={form.control}
                    name="skill_ids"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={skill.id}
                        >
                          <Group align="start" gap={3}>
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
                            <FormLabel className="cursor-pointer font-normal">
                              {skill.name}
                            </FormLabel>
                          </Group>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </Grid>
            </ScrollArea>
            <FormMessage />
          </FormItem>
        )}
      />
    </Stack>
  );
}
