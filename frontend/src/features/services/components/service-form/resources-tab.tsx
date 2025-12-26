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
  Slider,
} from "@/shared/ui";
import { NumberInput } from "@/shared/ui/custom/number-input";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ServiceFormValues } from "../../model/schemas";
import { Stack, Group, Grid } from "@/shared/ui/layout";

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

  // Helper to get group name safely
  const getGroupName = (groupId: string) => {
    return availableResourceGroups.find((g) => g.id === groupId)?.name || "Unknown";
  };

  return (
    <Stack gap={6} className="py-4">
      {/* Visual Timeline Preview */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <h4 className="mb-4 text-sm font-medium text-muted-foreground">Mô phỏng quy trình</h4>
        <div className="relative h-12 w-full rounded-lg bg-muted/30">
           {/* Time markers */}
           <div className="absolute -bottom-6 left-0 text-xs text-muted-foreground">0p</div>
           <div className="absolute -bottom-6 right-0 text-xs text-muted-foreground">{duration}p</div>

           {/* Timeline Bars */}
           {watchRequirements?.map((req, index) => {
              if (!req.group_id) return null;

              const startPct = (req.start_delay / duration) * 100;
              const usage = req.usage_duration || (duration - req.start_delay);
              const widthPct = (usage / duration) * 100;

              // Cap at 100%
              const finalWidth = Math.min(widthPct, 100 - startPct);

              return (
                 <div
                    key={index}
                    className="absolute top-1/2 -translate-y-1/2 flex h-8 items-center justify-center rounded-md text-[10px] font-medium text-white shadow-sm transition-all hover:z-10"
                    style={{
                       left: `${startPct}%`,
                       width: `${finalWidth}%`,
                       backgroundColor: getItemColor(index),
                    }}
                    title={`${getGroupName(req.group_id)}: ${req.start_delay}p - ${req.start_delay + usage}p`}
                 >
                    <span className="truncate px-1">{index + 1}</span>
                 </div>
              )
           })}
        </div>
        <div className="mt-8"></div>
      </div>

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

                {/* Quantity */}
                <FormField
                  control={form.control}
                  name={`resource_requirements.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số lượng</FormLabel>
                      <FormControl>
                        <NumberInput
                           min={1}
                           value={field.value}
                           onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Start Delay */}
                <FormField
                  control={form.control}
                  name={`resource_requirements.${index}.start_delay`}
                  render={({ field }) => (
                    <FormItem>
                      <Group justify="between" className="mb-2">
                         <FormLabel>Bắt đầu từ phút thứ</FormLabel>
                         <span className="text-xs font-mono">{field.value}p</span>
                      </Group>
                      <FormControl>
                         <Slider
                            min={0}
                            max={duration - 5}
                            step={5}
                            value={[field.value || 0]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                         />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Usage Duration */}
                <FormField
                  control={form.control}
                  name={`resource_requirements.${index}.usage_duration`}
                  render={({ field }) => (
                    <FormItem>
                       <Group justify="between" className="mb-2">
                         <FormLabel>Thời lượng sử dụng</FormLabel>
                         <span className="text-xs font-mono">
                            {field.value ? `${field.value}p` : "Suốt dịch vụ"}
                         </span>
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
                            <SelectItem value="full">Suốt dịch vụ ({maxDuration}p)</SelectItem>
                            {[5, 10, 15, 20, 30, 45, 60].map(min => (
                               <SelectItem key={min} value={String(min)} disabled={min > maxDuration}>
                                  {min} phút
                                </SelectItem>
                            ))}
                         </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
