"use client"

import { Skill } from "@/features/services/types"
import { cn } from "@/shared/lib/utils"
import { InputWithIcon } from "@/shared/ui/custom/input-with-icon"
import { SelectWithIcon } from "@/shared/ui/custom/select-with-icon"
import { TagInput } from "@/shared/ui/custom/tag-input"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Textarea } from "@/shared/ui/textarea"
import { Briefcase, Check, Mail, Phone, User } from "lucide-react"
import { useFormContext } from "react-hook-form"

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
  const role = form.watch("role")


  const GeneralInfo = () => (
    <div className="space-y-4">
      {/* Premium Avatar Upload UI */}
      <div className="flex items-start gap-6 p-4 border rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group">
         <div className="relative">
             <div className="size-20 rounded-full bg-background flex items-center justify-center border-2 border-dashed border-muted-foreground/30 group-hover:border-primary/50 transition-all shadow-sm overflow-hidden">
                 {mode === "update" ? (
                     <User className="size-8 text-muted-foreground/50" />
                 ) : (
                     <div className="text-center">
                         <User className="size-8 text-muted-foreground/50 mx-auto" />
                     </div>
                 )}
             </div>
             <button
                type="button"
                className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground shadow-md hover:scale-110 transition-transform"
                title="Tải ảnh lên"
             >
                 <Check className="size-3" />
             </button>
         </div>
         <div className="flex-1 space-y-1">
             <div className="flex items-center justify-between">
                 <p className="text-sm font-medium text-foreground">Ảnh đại diện</p>
                 <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">Sắp ra mắt</span>
             </div>
             <p className="text-xs text-muted-foreground leading-relaxed">
                 Hỗ trợ định dạng JPG, PNG. Kích thước tối đa 5MB.<br/>
                 Tải lên ảnh chân dung rõ nét để hiển thị tốt nhất trên lịch.
             </p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
                <FormItem>
                <FormLabel className="text-foreground/80 font-normal">Họ và tên</FormLabel>
                <FormControl>
                    <InputWithIcon
                    icon={User}
                    placeholder="Nguyễn Văn A"
                    {...field}
                    className="bg-background h-10"
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />

        {mode === "create" ? (
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-foreground/80 font-normal">Email</FormLabel>
                    <FormControl>
                    <InputWithIcon
                        icon={Mail}
                        type="email"
                        placeholder="email@example.com"
                        {...field}
                        className="bg-background h-10"
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        ) : (
            <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-foreground/80 font-normal">Số điện thoại</FormLabel>
                    <FormControl>
                    <InputWithIcon
                        icon={Phone}
                        type="tel"
                        placeholder="0912 345 678"
                        {...field}
                        className="h-10"
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        )}
      </div>

      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground/80 font-normal">Giới thiệu ngắn</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Mô tả kinh nghiệm, thế mạnh chuyên môn..."
                className="resize-none min-h-[100px] bg-background focus:ring-1"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )

  const ProfessionalInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80 font-normal">Vai trò</FormLabel>
                  <SelectWithIcon
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={mode === "update"} // Role change usually restricted
                    icon={Briefcase}
                    placeholder="Chọn vai trò"
                    options={[
                      { label: "Quản trị viên", value: "admin" },
                      { label: "Lễ tân", value: "receptionist" },
                      { label: "Kỹ thuật viên", value: "technician" },
                    ]}
                    isError={!!form.formState.errors.role}
                    className="h-10"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80 font-normal">Chức danh</FormLabel>
                  <FormControl>
                    <InputWithIcon
                      icon={Briefcase}
                      placeholder="VD: Senior Tech"
                      {...field}
                      className="bg-background h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
      </div>

      <FormField
        control={form.control}
        name="color_code"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground/80 font-normal flex items-center justify-between">
              <span>Màu hiển thị (Lịch)</span>
              <span className="text-xs text-muted-foreground font-normal">Được dùng để định danh trên lịch hẹn</span>
            </FormLabel>
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
            <FormMessage />
          </FormItem>
        )}
      />

      {(role === "technician") && (
        <div className="space-y-2 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2 duration-300 pt-2">
            <FormField
                control={form.control}
                name="skill_ids"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-foreground/80 font-normal">Kỹ năng chuyên môn</FormLabel>
                        <FormControl>
                            <TagInput
                                options={skills.map(s => ({ id: s.id, label: s.name }))}
                                selectedIds={field.value || []}
                                newTags={[]}
                                onSelectedChange={(ids) => field.onChange(ids)}
                                onNewTagsChange={() => {}}
                                placeholder="Chọn kỹ năng..."
                                isError={!!form.formState.errors.skill_ids}
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

  const HRInfo = () => (
    <div className="space-y-4">
             <FormField
                control={form.control}
                name="hired_at"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-foreground/80 font-normal">Ngày tuyển dụng</FormLabel>
                        <FormControl>
                            <InputWithIcon

                                type="date"
                                {...field}
                                className="bg-background"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="commission_rate"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-foreground/80 font-normal">Hoa hồng (%)</FormLabel>
                        <FormControl>
                            <InputWithIcon

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

  if (mode === "create") {

    return (
        <div className={cn("space-y-6", className)}>
            <GeneralInfo />
            <div className="h-[1px] bg-border/50" />
            <ProfessionalInfo />
            <div className="h-[1px] bg-border/50" />
            <HRInfo />
        </div>
    )
  }


  return (
    <div className={cn("w-full", className)}>
        <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="general">Thông tin chung</TabsTrigger>
                <TabsTrigger value="professional">Nghiệp vụ</TabsTrigger>
                <TabsTrigger value="hr">Nhân sự</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="space-y-4">
                <GeneralInfo />
            </TabsContent>
            <TabsContent value="professional" className="space-y-4">
                <ProfessionalInfo />
            </TabsContent>
             <TabsContent value="hr" className="space-y-4">
                <HRInfo />
            </TabsContent>
        </Tabs>
    </div>
  )
}
