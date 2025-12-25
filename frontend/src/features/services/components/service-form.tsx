"use client";

import { Resource, BedType } from "@/features/resources";
import { cn } from "@/shared/lib/utils";
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

export function ServiceForm({
  mode, // mode prop kept for potential future use or prop compatibility
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

  return (
    <div className={cn("w-full space-y-6 pt-0", className)}>
      {/* Basic Info */}
      <ServiceBasicInfo
        categories={categories}
        onCategoriesChange={setCategories}
      />

      {/* Time & Price */}
      <ServiceTimePriceInfo duration={duration} bufferTime={bufferTime} />

      {/* Resources */}
      <ServiceResourcesInfo
        availableBedTypes={availableBedTypes}
        skills={skills}
        onSkillsChange={setSkills}
        availableEquipment={availableEquipment}
        duration={duration}
      />
    </div>
  );
}
