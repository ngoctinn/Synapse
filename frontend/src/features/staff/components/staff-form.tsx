"use client"

import { SkillManagerDialog } from "@/features/services/components/skill-manager/skill-manager-dialog"
import { Skill } from "@/features/services/types"
import { cn } from "@/shared/lib/utils"
import {
  Button,
  DatePicker,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  showToast,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TagInput,
  Textarea,
} from "@/shared/ui"
import { format, parse } from "date-fns"
import { Briefcase, Check, Mail, Phone, Settings2, User } from "lucide-react"
import { useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"

interface StaffFormProps {
  mode: "create" | "update"
  skills: Skill[]
  className?: string
}

const COLOR_PRESETS = [
    "#3B82F6", // Blue
    "#EF4444", // Red
    "#10B981", // Emerald
    "#F59E0B", // Amber
    "#8B5CF6", // Violet
    "#EC4899", // Pink
    "#6366F1", // Indigo
    "#14B8A6", // Teal
]

export function StaffForm({ mode, skills, className }: StaffFormProps) {
  const form = useFormContext()
  const control = form.control
  const role = useWatch({ control, name: "role" })
  const [availableSkills, setAvailableSkills] = useState<Skill[]>(skills)
  const [isSkillManagerOpen, setSkillManagerOpen] = useState(false)

  return (
    <div className={cn("w-full", className)}>
         <SkillManagerDialog
            open={isSkillManagerOpen}
            onOpenChange={setSkillManagerOpen}
            onSkillsChange={setAvailableSkills}
        />
        {mode === "create" ? (
             <div className="space-y-6">
                 {renderGeneralInfo()}
                 <div className="h-px bg-border/50" />
                 {renderProfessionalInfo()}
                 <div className="h-px bg-border/50" />
                 {renderHRInfo()}
             </div>
        ) : (
            <Tabs defaultValue="general" className="w-full">
                <TabsList variant="form" size="lg" fullWidth gridCols={3}>
                    <TabsTrigger value="general" variant="form">Thông tin chung</TabsTrigger>
                    <TabsTrigger value="professional" variant="form">Nghiệp vụ</TabsTrigger>
                    <TabsTrigger value="hr" variant="form">Nhân sự</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="space-y-4 border rounded-lg bg-card p-4">
                    {renderGeneralInfo()}
                </TabsContent>
                <TabsContent value="professional" className="space-y-4 border rounded-lg bg-card p-4">
                    {renderProfessionalInfo()}
                </TabsContent>
                 <TabsContent value="hr" className="space-y-4 border rounded-lg bg-card p-4">
                    {renderHRInfo()}
                </TabsContent>
            </Tabs>
        )}
    </div>
  )

  function renderGeneralInfo() {
    return (
    <div className="space-y-4">
      {/* Premium Avatar Upload UI */}
      {/* Avatar Upload - Simplified / Hidden for now as per feedback */}
      <div className="flex items-center gap-4 p-4 border rounded-xl bg-muted/20">
         <div className="size-12 rounded-full bg-background flex items-center justify-center border border-dashed border-muted-foreground/30">
             <User className="size-6 text-muted-foreground/50" />
         </div>
         <div className="flex-1">
             <p className="text-sm font-medium text-foreground">Ảnh đại diện</p>
             <p className="text-xs text-muted-foreground">Tính năng đang được phát triển.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
            control={control}
            name="full_name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Họ và tên</FormLabel>
                <FormControl>
                    <Input
                    startContent={<User className="size-4" />}
                    placeholder="Nguyễn Văn A"
                    {...field}
                    className="bg-background"
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />

        {mode === "create" ? (
            <FormField
                control={control}
                name="email"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                    <Input
                        startContent={<Mail className="size-4" />}
                        type="email"
                        placeholder="email@example.com"
                        {...field}
                        className="bg-background"
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        ) : (
            <FormField
                control={control}
                name="phone_number"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                    <Input
                        startContent={<Phone className="size-4" />}
                        type="tel"
                        placeholder="0912 345 678"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        )}
      </div>

      <FormField
        control={control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Giới thiệu ngắn</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Mô tả kinh nghiệm, thế mạnh chuyên môn..."
                className="resize-none min-h-24 bg-background focus:ring-1"
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

  function renderProfessionalInfo() {
    return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
              control={control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vai trò</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={mode === "update"}
                  >
                    <SelectTrigger startContent={<Briefcase className="size-4" />}>
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Quản trị viên</SelectItem>
                      <SelectItem value="receptionist">Lễ tân</SelectItem>
                      <SelectItem value="technician">Kỹ thuật viên</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chức danh</FormLabel>
                  <FormControl>
                    <Input
                      startContent={<Briefcase className="size-4" />}
                      placeholder="VD: Senior Tech"
                      {...field}
                      className="bg-background"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
      </div>

      <FormField
        control={control}
        name="color_code"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Màu hiển thị (Lịch)</FormLabel>
            <div className="flex flex-wrap gap-3 p-3 border rounded-lg bg-background/50">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => field.onChange(color)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && field.onChange(color)}
                  aria-label={`Chọn màu ${color}`}
                  aria-pressed={field.value === color}
                  className={cn(
                    "size-8 rounded-full transition-all flex items-center justify-center relative focus-premium",
                    field.value === color
                      ? "ring-2 ring-offset-2 ring-primary scale-110 shadow-sm"
                      : "hover:scale-110 hover:shadow-sm opacity-80 hover:opacity-100"
                  )}
                  style={{ backgroundColor: color }}
                  title={color}
                >
                  {field.value === color && (
                      <Check className="w-4 h-4 text-white drop-shadow-md" strokeWidth={3} />
                  )}
                </button>
              ))}
            </div>
            <FormDescription>
              Được dùng để định danh trên lịch hẹn
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {(role === "technician") && (
        <div className="space-y-3 pt-2 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between px-1">
                <FormLabel className="text-sm font-medium">Kỹ năng chuyên môn</FormLabel>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs text-muted-foreground hover:text-primary gap-1 px-2"
                    onClick={() => setSkillManagerOpen(true)}
                >
                    <Settings2 className="w-3 h-3" /> Quản lý kỹ năng
                </Button>
            </div>
            <FormField
                control={control}
                name="skill_ids"
                render={({ field, fieldState }) => (
                    <FormItem className="space-y-0">
                        <FormControl>
                            <TagInput
                                options={availableSkills.map(s => ({ id: s.id, label: s.name }))}
                                selectedIds={field.value || []}
                                newTags={[]}
                                onSelectedChange={(ids) => field.onChange(ids)}
                                onNewTagsChange={() => showToast.info("Vui lòng dùng nút 'Quản lý kỹ năng' để thêm mới")}
                                placeholder="Chọn kỹ năng..."
                                isError={fieldState.invalid}
                                className="min-h-[40px] text-sm bg-background"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
      )}
    </div>
    )
  }

  function renderHRInfo() {
    return (
    <div className="space-y-4">
             <FormField
                control={control}
                name="hired_at"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Ngày tuyển dụng</FormLabel>
                        <FormControl>
                            <DatePicker
                                value={field.value ? parse(field.value, "yyyy-MM-dd", new Date()) : undefined}
                                onChange={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                                placeholder="Chọn ngày"
                                className="bg-background"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={control}
                name="commission_rate"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Hoa hồng (%)</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                min={0}
                                max={100}
                                placeholder="0"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                className="bg-background"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        {/* Placeholder for future active status toggle if needed in UI, or keep simple */}
    </div>
    )
  }
}
