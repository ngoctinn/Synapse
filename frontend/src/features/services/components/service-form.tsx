"use client"

import { Resource, RoomType } from "@/features/resources"
import { cn } from "@/shared/lib/utils"
import { RequiredMark } from "@/shared/ui"
import { ColorSwatchGroup } from "@/shared/ui/custom/color-swatch-group"
import { DurationPicker } from "@/shared/ui/custom/duration-picker"
import { FormTabs, FormTabsContent } from "@/shared/ui/custom/form-tabs"
import { TagInput } from "@/shared/ui/custom/tag-input"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/ui/form"
import { Input } from "@/shared/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"
import { Switch } from "@/shared/ui/switch"
import { Textarea } from "@/shared/ui/textarea"
import { useFormContext } from "react-hook-form"
import { SERVICE_COLORS } from "../constants"
import { Skill } from "../types"
import { EquipmentTimelineEditor } from "./equipment-timeline-editor"
import { ImageUpload } from "./image-upload"
import { ServiceTimeVisualizer } from "./service-time-visualizer"

interface ServiceFormProps {
  mode: "create" | "update"
  availableSkills: Skill[]
  availableRoomTypes: RoomType[]
  availableEquipment: Resource[]
  className?: string
}



// --- SUB-COMPONENTS ---

function ServiceBasicInfo() {
  const form = useFormContext()
  return (
    <div className="space-y-6">
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
                  <FormLabel>Ảnh đại diện</FormLabel>
                   <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      className="aspect-video w-full h-[200px] object-cover rounded-md"
                    />
                  </FormControl>
                  <p className="text-[11px] text-muted-foreground mt-1.5">
                    Khuyến nghị: Tỷ lệ 16:9, tối đa 2MB (JPG, PNG)
                  </p>
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
                <FormLabel>
                  Tên dịch vụ <RequiredMark />
                </FormLabel>
                <FormControl>
                  <Input
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
                  <FormLabel className="text-xs">Màu hiển thị</FormLabel>
                  <FormControl>
                    <ColorSwatchGroup
                      value={field.value}
                      onChange={field.onChange}
                      options={SERVICE_COLORS}
                      ariaLabel="Chọn màu hiển thị cho dịch vụ"
                    />
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
            <FormLabel>Mô tả</FormLabel>
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
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
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
              <FormLabel>
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
            <FormLabel>
              Giá niêm yết
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                min={0}
                value={field.value ?? ""}
                onChange={(e) => {
                  const val = e.target.valueAsNumber
                  field.onChange(isNaN(val) ? 0 : val)
                }}
                onBlur={() => {
                  // Ensure value is not negative on blur
                  if (field.value < 0) field.onChange(0)
                }}
                endContent={
                  <div className="flex items-center justify-center h-full px-3 text-sm text-muted-foreground font-medium bg-muted/50 border-l">
                    VNĐ
                  </div>
                }
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
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="resource_requirements.room_type_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Loại phòng yêu cầu
            </FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger
                    className="bg-background h-10 w-full"
                  >
                    <SelectValue placeholder="-- Chọn loại phòng --" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableRoomTypes.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <FormLabel>
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
        <FormLabel>
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

const SERVICE_FORM_TABS = [
  { value: "basic", label: "Thông tin" },
  { value: "time", label: "Giá & Thời gian" },
  { value: "resources", label: "Tài nguyên" },
]

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

  // Render logic simplified to direct component usage

  if (mode === "create") {
    return (
      <div className={cn("w-full space-y-6 pt-2", className)}>
        {/* Basic Info Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-base">Thông tin cơ bản</h3>
          <ServiceBasicInfo />
        </div>

        {/* Time & Price Section */}
        <div className="space-y-4">
          <div className="border-t pt-4">
            <h3 className="font-semibold text-base">Thời gian & Chi phí</h3>
          </div>
          <ServiceTimePriceInfo duration={duration} bufferTime={bufferTime} />
        </div>

        {/* Resources Section */}
        <div className="space-y-4">
          <div className="border-t pt-4">
            <h3 className="font-semibold text-base">Tài nguyên yêu cầu</h3>
          </div>
          <ServiceResourcesInfo
            availableRoomTypes={availableRoomTypes}
            skillOptions={skillOptions}
            availableEquipment={availableEquipment}
            duration={duration}
          />
        </div>
      </div>
    )
  }

  // Update Mode: Use Tabs
  return (
    <div className={cn("w-full", className)}>
      <FormTabs tabs={SERVICE_FORM_TABS} defaultValue="basic">
         <div className="mt-4">
            <FormTabsContent value="basic" className="mt-0">
                <ServiceBasicInfo />
            </FormTabsContent>
            <FormTabsContent value="time" className="mt-0">
                <ServiceTimePriceInfo duration={duration} bufferTime={bufferTime} />
            </FormTabsContent>
            <FormTabsContent value="resources" className="mt-0">
                <ServiceResourcesInfo
                  availableRoomTypes={availableRoomTypes}
                  skillOptions={skillOptions}
                  availableEquipment={availableEquipment}
                  duration={duration}
                />
            </FormTabsContent>
         </div>
      </FormTabs>
    </div>
  )
}
