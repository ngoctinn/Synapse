import { ResourceGroup } from "@/features/resources";
import {
  Button,
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
  Slider
} from "@/shared/ui";
import { NumberInput } from "@/shared/ui/custom/number-input";
import { ResourceTimeline } from "@/shared/ui/custom/resource-timeline";
import { Grid, Group, Stack } from "@/shared/ui/layout";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ServiceFormValues } from "../../model/schemas";

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
            <div key={field.id} className="relative rounded-xl border bg-card p-4 transition-all hover:border-primary/50">
              <div className="absolute right-2 top-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Header with Color Indicator */}
              <Group align="center" gap={2} className="mb-4">
                 <div className="h-3 w-3 rounded-full" style={{ backgroundColor: getItemColor(index) }} />
                 <span className="text-sm font-medium">Tài nguyên #{index + 1}</span>
              </Group>

              <Grid gap={4} className="grid-cols-1 md:grid-cols-2">
                {/* Resource Group */}
                <div className="col-span-1 md:col-span-2">
                   <FormField
                    control={form.control}
                    name={`resource_requirements.${index}.group_id`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loại tài nguyên</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn loại (VD: Giường)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableResourceGroups.map((group) => (
                              <SelectItem key={group.id} value={group.id}>
                                {group.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-1 md:col-span-2">
                   <div className="flex items-center gap-2">
                      <Button
                         type="button"
                         variant="ghost"
                         size="sm"
                         className="h-8 text-xs text-muted-foreground w-full justify-start pl-0 hover:bg-transparent hover:text-primary"
                         onClick={(e) => {
                            e.preventDefault(); // Prevent form submit
                            const currentState = advancedOpen[index];
                            setAdvancedOpen({ ...advancedOpen, [index]: !currentState });
                         }}
                      >
                         {advancedOpen[index] ? <ChevronUp className="mr-1 h-3 w-3" /> : <ChevronDown className="mr-1 h-3 w-3" />}
                         {advancedOpen[index] ? "Thu gọn cấu hình nâng cao" : "Cấu hình nâng cao (Số lượng, Thời lượng)"}
                      </Button>
                   </div>

                   {/* Advanced Fields (Collapsible) */}
                   {advancedOpen[index] && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                       {/* Quantity */}
                       <FormField
                          control={form.control}
                          name={`resource_requirements.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <Group justify="between">
                                 <FormLabel>Số lượng (Định mức)</FormLabel>
                                 {Number(field.value) > 1 && (
                                    <span className="text-xs font-bold text-amber-600">Đang yêu cầu {field.value}</span>
                                 )}
                              </Group>
                              <FormControl>
                                <NumberInput
                                   min={1}
                                   value={field.value}
                                   onChange={field.onChange}
                                />
                              </FormControl>
                               <FormMessage className="text-xs text-muted-foreground">
                                *Mặc định: 1
                              </FormMessage>
                            </FormItem>
                          )}
                        />

                        {/* Usage Duration */}
                        <FormField
                          control={form.control}
                          name={`resource_requirements.${index}.usage_duration`}
                          render={({ field }) => (
                            <FormItem>
                               <Group justify="between">
                                 <FormLabel>Thời lượng</FormLabel>
                              </Group>
                              <Select
                                 onValueChange={(val) => field.onChange(val === "full" ? null : Number(val))}
                                 value={field.value ? String(field.value) : "full"}
                              >
                                 <FormControl>
                                    <SelectTrigger>
                                       <SelectValue placeholder="Chọn thời lượng" />
                                    </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                    <SelectItem value="full">Toàn thời gian ({maxDuration}p)</SelectItem>
                                    {[5, 10, 15, 20, 30, 45, 60].map(min => (
                                       <SelectItem key={min} value={String(min)} disabled={min > maxDuration}>
                                          {min} phút
                                        </SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
                               <FormMessage className="text-xs text-muted-foreground">
                                *Mặc định: Toàn thời gian
                              </FormMessage>
                            </FormItem>
                          )}
                        />

                        {/* Start Delay (Moved here) */}
                        <FormField
                          control={form.control}
                          name={`resource_requirements.${index}.start_delay`}
                          render={({ field }) => (
                            <FormItem className="col-span-1 md:col-span-2">
                              <Group justify="between" className="mb-2">
                                 <FormLabel>Thời gian chờ (Start Delay)</FormLabel>
                                 <span className="text-xs font-mono">{field.value}p</span>
                              </Group>
                              <FormControl>
                                 <Slider
                                    min={0}
                                    max={duration - 5}
                                    step={5}
                                    value={[field.value || 0]}
                                    onValueChange={(vals: number[]) => field.onChange(vals[0])}
                                 />
                              </FormControl>
                              <FormMessage className="text-xs text-muted-foreground">
                                *Dịch vụ bắt đầu sau bao nhiêu phút mới dùng tài nguyên này
                              </FormMessage>
                            </FormItem>
                          )}
                        />
                    </div>
                   )}
                </div>
              </Grid>
            </div>
           )
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
