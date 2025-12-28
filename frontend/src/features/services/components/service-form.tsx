"use client";

import { ResourceGroup } from "@/features/resources";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui";
import { AlertCircle } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { ServiceCategory, Skill } from "../model/types";
import { BasicTab } from "./service-form/basic-tab";
import { ResourcesTab } from "./service-form/resources-tab";

import { Stack } from "@/shared/ui/layout";
import { SkillsTab } from "./service-form/skills-tab";

interface ServiceFormProps {
  mode: "create" | "update";
  availableSkills: Skill[];
  availableCategories: ServiceCategory[];
  availableResourceGroups: ResourceGroup[];
  className?: string;
}

export function ServiceForm({
  // mode,
  availableSkills,
  availableCategories,
  availableResourceGroups,
  className,
}: ServiceFormProps) {
  const form = useFormContext();

  // Watch for validation errors to show indicators on tabs
  const { errors } = form.formState;
  const hasBasicErrors = !!errors.name || !!errors.price || !!errors.category_id;
  const hasResourceErrors = !!errors.resource_requirements;
  const hasSkillErrors = !!errors.skill_ids;

  const duration = form.watch("duration") || 60;

  return (
    <Stack gap={2} className={className}>
      <Tabs defaultValue="basic" className="h-full w-full">
        <TabsList gridCols={3} fullWidth>
          <TabsTrigger value="basic" className="relative">
            Thông tin
            {hasBasicErrors && (
               <AlertCircle className="text-destructive absolute -right-1 -top-1 h-3 w-3" />
            )}
          </TabsTrigger>
          <TabsTrigger value="resources" className="relative">
            Tài nguyên
            {hasResourceErrors && (
               <AlertCircle className="text-destructive absolute -right-1 -top-1 h-3 w-3" />
            )}
          </TabsTrigger>
          <TabsTrigger value="skills" className="relative">
            Kỹ năng
            {hasSkillErrors && (
               <AlertCircle className="text-destructive absolute -right-1 -top-1 h-3 w-3" />
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" asChild>
          <Stack gap={4} className="mt-4">
            <BasicTab categories={availableCategories} />
          </Stack>
        </TabsContent>

        <TabsContent value="resources" asChild>
          <Stack gap={4} className="mt-4">
            <ResourcesTab
                availableResourceGroups={availableResourceGroups}
                duration={duration}
            />
          </Stack>
        </TabsContent>

        <TabsContent value="skills" asChild>
          <Stack gap={4} className="mt-4">
            <SkillsTab availableSkills={availableSkills} />
          </Stack>
        </TabsContent>
      </Tabs>
    </Stack>
  );
}
