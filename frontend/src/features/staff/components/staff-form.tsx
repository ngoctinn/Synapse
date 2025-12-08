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

  return (
    <div className={cn("space-y-6", className)}>
      {/* Group 1: Basic Info */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/80 font-normal">Vai trò</FormLabel>
                <SelectWithIcon
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={mode === "update"}
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
                    // value={field.value || ""} // Ensure controlled input with empty string fallback
                    className="bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="h-[1px] bg-border/50" />

      {/* Group 2: Appearance & Bio */}
      <div className="space-y-4">
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
                  // value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Group 3: Skills (Conditional) */}
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
}
