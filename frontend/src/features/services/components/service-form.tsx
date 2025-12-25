"use client";

import { Resource, BedType } from "@/features/resources";
import { cn } from "@/shared/lib/utils";
import { FormTabs, FormTabsContent } from "@/shared/ui/custom/form-tabs";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { ServiceCategory, Skill } from "../model/types";
import { ServiceBasicInfo } from "./service-form/service-basic-info";
import { ServiceTimePriceInfo } from "./service-form/service-time-price-info";
import { ServiceResourcesInfo } from "./service-form/service-resources-info";

interface ServiceFormProps {
  mode: "create" | "update";
  availableSkills: Skill[];
  availableBedTypes: BedType[];
  availableEquipment: Resource[];
  availableCategories: ServiceCategory[];
  className?: string;
}

const SERVICE_FORM_TABS = [
  { value: "basic", label: "Thông tin" },
  { value: "time", label: "Giá & Thời gian" },
  { value: "resources", label: "Tài nguyên" },
];

export function ServiceForm({
  mode,
  availableSkills,
  availableBedTypes,
  availableEquipment,
  availableCategories,
  className,
}: ServiceFormProps) {
  const form = useFormContext();
  const duration = form.watch("duration");
  const bufferTime = form.watch("buffer_time");

  // Local state for categories to support "Quick Add" updates
  const [categories, setCategories] = useState(availableCategories);
  const [skills, setSkills] = useState(availableSkills);

  if (mode === "create") {
    return (
      <div className={cn("w-full space-y-6 pt-2", className)}>
        {/* Basic Info Section */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold">Thông tin cơ bản</h3>
          <ServiceBasicInfo
            categories={categories}
            onCategoriesChange={setCategories}
          />
        </div>

        {/* Time & Price Section */}
        <div className="space-y-4">
          <div className="border-t pt-4">
            <h3 className="text-base font-semibold">Thời gian & Chi phí</h3>
          </div>
          <ServiceTimePriceInfo duration={duration} bufferTime={bufferTime} />
        </div>

        {/* Resources Section */}
        <div className="space-y-4">
          <div className="border-t pt-4">
            <h3 className="text-base font-semibold">Tài nguyên yêu cầu</h3>
          </div>
          <ServiceResourcesInfo
            availableBedTypes={availableBedTypes}
            skills={skills}
            onSkillsChange={setSkills}
            availableEquipment={availableEquipment}
            duration={duration}
          />
        </div>
      </div>
    );
  }

  // Update Mode: Use Tabs
  return (
    <div className={cn("w-full", className)}>
      <FormTabs tabs={SERVICE_FORM_TABS} defaultValue="basic">
        <div className="mt-4">
          <FormTabsContent value="basic" className="mt-0">
            <ServiceBasicInfo
              categories={categories}
              onCategoriesChange={setCategories}
            />
          </FormTabsContent>
          <FormTabsContent value="time" className="mt-0">
            <ServiceTimePriceInfo duration={duration} bufferTime={bufferTime} />
          </FormTabsContent>
          <FormTabsContent value="resources" className="mt-0">
            <ServiceResourcesInfo
              availableBedTypes={availableBedTypes}
              skills={skills}
              onSkillsChange={setSkills}
              availableEquipment={availableEquipment}
              duration={duration}
            />
          </FormTabsContent>
        </div>
      </FormTabs>
    </div>
  );
}
