import { ResourceGroup } from "@/features/resources";
import {
  Button
} from "@/shared/ui";
import { ResourceTimeline } from "@/shared/ui/custom/resource-timeline";
import { Stack } from "@/shared/ui/layout";
import { Plus } from "lucide-react";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ServiceFormValues } from "../../model/schemas";
import { ResourceRequirementCard } from "./resource-requirement-card";

interface ResourcesTabProps {
  availableResourceGroups: ResourceGroup[];
  duration: number; // Total service duration for timeline
}

export function ResourcesTab({ availableResourceGroups, duration }: ResourcesTabProps) {
  const form = useFormContext<ServiceFormValues>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "resource_requirements",
  });

  const watchRequirements = form.watch("resource_requirements");
  const [advancedOpen, setAdvancedOpen] = React.useState<Record<number, boolean>>({});

  // Helper to get group name safely
  const getGroupName = (groupId: string) => {
    return availableResourceGroups.find((g) => g.id === groupId)?.name || "Unknown";
  };

  const timelineItems = watchRequirements?.map((req, index) => {
      if (!req.group_id) return null;
      const startPct = (req.start_delay / duration) * 100;
      const usage = req.usage_duration || (duration - req.start_delay);
      const widthPct = (usage / duration) * 100;
      const finalWidth = Math.min(widthPct, 100 - startPct);

      return {
        startPercentage: startPct,
        widthPercentage: finalWidth,
        color: getItemColor(index),
        label: (index + 1).toString(),
        tooltip: `${getGroupName(req.group_id)}: ${req.start_delay}p - ${req.start_delay + usage}p`
      };
  }).filter((x): x is NonNullable<typeof x> => x !== null) || [];

  return (
    <Stack gap={6}>
      {/* Visual Timeline Preview */}
      <ResourceTimeline duration={duration} items={timelineItems} />

      {/* Dynamic List */}
      <Stack gap={4}>
        {fields.map((field, index) => {
           // Watch values for this specific field to validate timeline
           const currentReq = watchRequirements?.[index];
           const maxDuration = duration - (currentReq?.start_delay || 0);

           return (
            <ResourceRequirementCard
              key={field.id}
              index={index}
              availableResourceGroups={availableResourceGroups}
              duration={duration}
              color={getItemColor(index)}
              isAdvancedOpen={advancedOpen[index]}
              onToggleAdvanced={() => {
                const currentState = advancedOpen[index];
                setAdvancedOpen({ ...advancedOpen, [index]: !currentState });
              }}
              onRemove={() => remove(index)}
              startDelay={currentReq?.start_delay || 0}
            />
          );
        })}

        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed"
          onClick={() => append({ group_id: "", quantity: 1, start_delay: 0, usage_duration: null })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm tài nguyên
        </Button>
      </Stack>
    </Stack>
  );
}

// Fixed color palette for timeline items
const COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Green
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Violet
  "#ec4899", // Pink
];

function getItemColor(index: number) {
   return COLORS[index % COLORS.length];
}
