"use client"

import { Resource, RoomType } from "@/features/resources"
import { cn } from "@/shared/lib/utils"
import { DurationPicker } from "@/shared/ui/custom/duration-picker"
import { InputWithIcon } from "@/shared/ui/custom/input-with-icon"
import { MoneyInput } from "@/shared/ui/custom/money-input"
import { SelectWithIcon } from "@/shared/ui/custom/select-with-icon"
import { TagInput } from "@/shared/ui/custom/tag-input"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form"
import { Switch } from "@/shared/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Textarea } from "@/shared/ui/textarea"
import { Box, Palette, Settings, Tag, Users } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { SERVICE_COLORS } from "../constants"
import { Skill } from "../types"
import { EquipmentTimelineEditor } from "./equipment-timeline-editor"
import { ImageUpload } from "./image-upload"
import { ServiceTimeVisualizer } from "./service-time-visualizer"

interface ServiceFormProps {
  mode: "create" | "edit"
  availableSkills: Skill[]
  availableRoomTypes: RoomType[]
  availableEquipment: Resource[]
  className?: string
}



// --- SUB-COMPONENTS ---

function ServiceBasicInfo() {
  const form = useFormContext()
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Active Toggle */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border">
        <div>
          <span className="text-sm font-medium">Trạng thái</span>
          <p className="text-xs text-muted-foreground">
            Ẩn/Hiện dịch vụ trên app khách hàng
          </p>
        </div>
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-primary"
                />
              </FormControl>
              <FormLabel className="cursor-pointer font-normal text-sm">
                {field.value ? "Hoạt động" : "Tạm ẩn"}
              </FormLabel>
            </FormItem>
          )}
        />
      </div>

      <div className="flex flex-col gap-6">
          <div className="flex justify-center">
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-foreground/80">Ảnh đại diện</FormLabel>
                   <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      className="aspect-video w-full h-[200px] object-cover rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/80">
                  Tên dịch vụ <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <InputWithIcon
                    icon={Tag}
                    placeholder="VD: Massage Body"
                    className="h-10 text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80 text-xs">Màu hiển thị</FormLabel>
                  <FormControl>
                      <div className="flex flex-wrap gap-1.5">
                        {SERVICE_COLORS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={cn(
                              "w-8 h-8 rounded-full border transition-all flex-shrink-0 cursor-pointer",
                              field.value === color
                                ? "ring-2 ring-primary ring-offset-1 scale-110"
                                : "hover:scale-110 hover:shadow-sm opacity-70 hover:opacity-100"
                            )}
                            style={{ backgroundColor: color }}
                            onClick={() => field.onChange(color)}
                          />
                        ))}
                      </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground/80">Mô tả</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Mô tả chi tiết..."
                className="min-h-[100px] resize-none text-sm"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

function ServiceTimePriceInfo({ duration, bufferTime }: { duration: number; bufferTime: number }) {
  const form = useFormContext()
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground/80">
                Thời lượng
              </FormLabel>
              <FormControl>
                <DurationPicker
                  value={field.value}
                  onChange={field.onChange}
                  min={15}
                  step={15}
                  className="h-10 text-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="buffer_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground/80">
                Nghỉ giữa ca
              </FormLabel>
              <FormControl>
                <DurationPicker
                  value={field.value}
                  onChange={field.onChange}
                  min={0}
                  step={15}
                  className="h-10 text-sm"
                  iconClassName="text-muted-foreground" // Ensure icon uses consistent color
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <ServiceTimeVisualizer
        duration={duration}
        bufferTime={bufferTime}
        className="bg-muted/20 border-2 border-dashed border-primary/20 rounded-xl p-4"
      />

      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground/80 flex items-center gap-2">
              <Palette className="w-4 h-4 text-primary" />
              Giá niêm yết
            </FormLabel>
            <FormControl>
              <MoneyInput
                value={field.value}
                onChange={field.onChange}
                className="h-10 text-sm"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

function ServiceResourcesInfo({
  availableRoomTypes,
  skillOptions,
  availableEquipment,
  duration
}: {
  availableRoomTypes: RoomType[]
  skillOptions: { id: string; label: string }[]
  availableEquipment: Resource[]
  duration: number
}) {
  const form = useFormContext()
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <FormField
        control={form.control}
        name="resource_requirements.room_type_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground/80">
              Loại phòng yêu cầu
            </FormLabel>
            <FormControl>
              <SelectWithIcon
                value={field.value}
                onValueChange={field.onChange}
                options={availableRoomTypes.map(t => ({ label: t.name, value: t.id }))}
                placeholder="-- Chọn loại phòng --"
                icon={Box}
                className="bg-background"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="skill_ids"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground/80 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Kỹ năng yêu cầu
            </FormLabel>
            <FormControl>
              <TagInput
                options={skillOptions}
                selectedIds={field.value}
                newTags={form.watch("new_skills")}
                onSelectedChange={field.onChange}
                onNewTagsChange={(tags) => form.setValue("new_skills", tags)}
                placeholder="Chọn kỹ năng..."
                className="min-h-[40px] text-sm bg-background"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-3 pt-2 border-t">
        <FormLabel className="text-foreground/80 flex items-center gap-2">
          <Settings className="w-4 h-4 text-primary" />
          Thiết bị & Timeline
        </FormLabel>
        <FormField
          control={form.control}
          name="resource_requirements.equipment_usage"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <EquipmentTimelineEditor
                  serviceDuration={duration}
                  availableEquipment={availableEquipment.filter(
                    (e) => e.type === "EQUIPMENT"
                  )}
                  value={field.value || []}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

export function ServiceForm({
  mode,
  availableSkills,
  availableRoomTypes,
  availableEquipment,
  className,
}: ServiceFormProps) {
  const form = useFormContext()
  const duration = form.watch("duration")
  const bufferTime = form.watch("buffer_time")

  const skillOptions = availableSkills.map((s) => ({ id: s.id, label: s.name }))

  return (
    <div className={cn("w-full h-full", className)}>
        <Tabs defaultValue="basic" className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mb-4 shrink-0">
            <TabsTrigger value="basic">Thông tin</TabsTrigger>
            <TabsTrigger value="time">Giá & Thời gian</TabsTrigger>
            <TabsTrigger value="resources">Tài nguyên</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto px-1 pb-4 [scrollbar-gutter:stable]">
            <TabsContent value="basic" className="mt-0">
                <ServiceBasicInfo />
            </TabsContent>
            <TabsContent value="time" className="mt-0">
                <ServiceTimePriceInfo duration={duration} bufferTime={bufferTime} />
            </TabsContent>
            <TabsContent value="resources" className="mt-0">
                <ServiceResourcesInfo
                  availableRoomTypes={availableRoomTypes}
                  skillOptions={skillOptions}
                  availableEquipment={availableEquipment}
                  duration={duration}
                />
            </TabsContent>
          </div>
        </Tabs>
    </div>
  )
}
