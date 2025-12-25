"use client";

import { ResourceGroup } from "@/features/resources";
import { cn } from "@/shared/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui";
import { AlertCircle } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { ServiceCategory, Skill } from "../model/types";
import { BasicTab } from "./service-form/basic-tab";
import { ResourcesTab } from "./service-form/resources-tab";

import { SkillsTab } from "./service-form/skills-tab";

interface ServiceFormProps {
  mode: "create" | "update";
  availableSkills: Skill[];
  availableCategories: ServiceCategory[];
  availableResourceGroups: ResourceGroup[];
  className?: string;
}

export function ServiceForm({
  mode,
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
  // const hasSkillErrors = !!errors.skill_ids; // Usually optional but if required

  const duration = form.watch("duration") || 60;

  return (
    <div className={cn("w-full pt-2", className)}>
      <Tabs defaultValue="basic" className="h-full w-full">
        <TabsList className="grid w-full grid-cols-3">
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
          <TabsTrigger value="skills">Kỹ năng</TabsTrigger>
        </TabsList>

        <div className="mt-4 h-full">
           <TabsContent value="basic" className="mt-0 space-y-4">
              <BasicTab categories={availableCategories} />
           </TabsContent>

           <TabsContent value="resources" className="mt-0 space-y-4">
              <ResourcesTab
                 availableResourceGroups={availableResourceGroups}
                 duration={duration}
              />
           </TabsContent>

           <TabsContent value="skills" className="mt-0 space-y-4">
              <SkillsTab availableSkills={availableSkills} />
           </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
