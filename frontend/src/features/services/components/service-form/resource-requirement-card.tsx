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
import { Box, Grid, HStack } from "@/shared/ui/layout";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { ServiceFormValues } from "../../model/schemas";

interface ResourceRequirementCardProps {
  index: number;
  availableResourceGroups: ResourceGroup[];
  duration: number;
  color: string;
  isAdvancedOpen: boolean;
  onToggleAdvanced: () => void;
  onRemove: () => void;
  startDelay: number;
}

export function ResourceRequirementCard({
  index,
  availableResourceGroups,
  duration,
  color,
  isAdvancedOpen,
  onToggleAdvanced,
  onRemove,
  startDelay,
}: ResourceRequirementCardProps) {
  const form = useFormContext<ServiceFormValues>();
  const maxDuration = duration - (startDelay || 0);
  return (
    <Box className="relative rounded-xl border bg-card p-4 transition-all hover:border-primary/50">
      <Box className="absolute right-2 top-2">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground hover:text-destructive"
          onClick={onRemove}
        >
          <Trash2 className="size-4" />
        </Button>
      </Box>

      {/* Header with Color Indicator */}
      <HStack align="center" gap={2} className="mb-4">
        <Box className="size-3 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-sm font-medium">Tài nguyên #{index + 1}</span>
      </HStack>

      <Grid gap={4} className="grid-cols-1 md:grid-cols-2">
        {/* Resource Group */}
        <Box className="col-span-1 md:col-span-2">
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
        </Box>

        <Box className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-full justify-start pl-0 text-xs text-muted-foreground hover:bg-transparent hover:text-primary"
              onClick={(e) => {
                e.preventDefault();
                onToggleAdvanced();
              }}
            >
              {isAdvancedOpen ? (
                <ChevronUp className="mr-1 size-3" />
              ) : (
                <ChevronDown className="mr-1 size-3" />
              )}
              {isAdvancedOpen
                ? "Thu gọn cấu hình nâng cao"
                : "Cấu hình nâng cao (Số lượng, Thời lượng)"}
            </Button>
          </div>

          {/* Advanced Fields (Collapsible) */}
          {isAdvancedOpen && (
            <div className="animate-in fade-in slide-in-from-top-2 mt-2 grid grid-cols-1 gap-4 border-t pt-4 duration-200 md:grid-cols-2">
              {/* Quantity */}
              <FormField
                control={form.control}
                name={`resource_requirements.${index}.quantity`}
                render={({ field }) => (
                  <FormItem>
                    <HStack justify="between">
                      <FormLabel>Số lượng (Định mức)</FormLabel>
                      {Number(field.value) > 1 && (
                        <span className="text-xs font-bold text-amber-600">
                          Đang yêu cầu {field.value}
                        </span>
                      )}
                    </HStack>
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
                    <HStack justify="between">
                      <FormLabel>Thời lượng</FormLabel>
                    </HStack>
                    <Select
                      onValueChange={(val) =>
                        field.onChange(val === "full" ? null : Number(val))
                      }
                      value={field.value ? String(field.value) : "full"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn thời lượng" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="full">
                          Toàn thời gian ({maxDuration}p)
                        </SelectItem>
                        {[5, 10, 15, 20, 30, 45, 60].map((min) => (
                          <SelectItem
                            key={min}
                            value={String(min)}
                            disabled={min > maxDuration}
                          >
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

              {/* Start Delay */}
              <FormField
                control={form.control}
                name={`resource_requirements.${index}.start_delay`}
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <HStack justify="between" className="mb-2">
                      <FormLabel>Thời gian chờ (Start Delay)</FormLabel>
                      <span className="text-xs font-mono">{field.value}p</span>
                    </HStack>
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
        </Box>
      </Grid>
    </Box>
  );
}
