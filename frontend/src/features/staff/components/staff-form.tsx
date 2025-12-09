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
      {/* Avatar Placeholder - Future Integration */}
      {mode === "update" && (
         <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/20">
            <div className="size-16 rounded-full bg-muted flex items-center justify-center border-2 border-background shadow-sm">
                <User className="size-8 text-muted-foreground" />
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium">Ảnh đại diện</p>
                <p className="text-xs text-muted-foreground">Chạm vào để thay đổi (Chưa hỗ trợ)</p>
            </div>
         </div>
      )}

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
                  className="bg-background"
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
                    className="bg-background"
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground/80 font-normal">Giới thiệu ngắn</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Kinh nghiệm, thế mạnh..."
                className="resize-none min-h-[80px] bg-background"
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
                  className="bg-background"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

      <FormField
        control={form.control}
        name="color_code"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground/80 font-normal">
              Màu hiển thị (Lịch)
            </FormLabel>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => field.onChange(color)}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center",
                    field.value === color
                      ? "border-primary scale-110 shadow-sm"
                      : "border-transparent opacity-70 hover:opacity-100"
                  )}
                  style={{ backgroundColor: color }}
                >
                  {field.value === color && <Check className="w-4 h-4 text-white" />}
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
