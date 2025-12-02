"use client"

import { updateStaff } from "@/features/staff/actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import * as React from "react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Skill } from "@/features/services/types"
import { Button } from "@/shared/ui/button"
import { showToast } from "@/shared/ui/custom/sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/ui/form"
import { Input } from "@/shared/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select"
import { Staff } from "../../types"
import { SkillSelector } from "../skill-selector"

const editStaffSchema = z.object({
  fullName: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  role: z.enum(["ADMIN", "RECEPTIONIST", "TECHNICIAN"]),
})

type EditStaffFormValues = z.infer<typeof editStaffSchema>

interface EditStaffModalProps {
  staff: Staff
  skills: Skill[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditStaffModal({ staff, skills, open, onOpenChange }: EditStaffModalProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

  const form = useForm<EditStaffFormValues>({
    resolver: zodResolver(editStaffSchema),
    defaultValues: {
      fullName: staff.name,
      phone: staff.phone || "",
      role: staff.role,
    },
  })

  // Initialize skills when modal opens or staff changes
  useEffect(() => {
    if (open) {
      form.reset({
        fullName: staff.name,
        phone: staff.phone || "",
        role: staff.role,
      })
      setSelectedSkills(staff.skills.map(s => s.id))
    }
  }, [open, staff, form])



  function onSubmit(data: EditStaffFormValues) {
    const formData = new FormData()
    formData.append("id", staff.id)
    formData.append("fullName", data.fullName)
    formData.append("phone", data.phone)
    formData.append("role", data.role)

    if (data.role === "TECHNICIAN") {
        formData.append("skill_ids", JSON.stringify(selectedSkills))
    }

    React.startTransition(() => {
      // We need to wrap dispatch because updateStaff signature in actions.ts might be different
      // Let's check updateStaff signature. It is (staffId: string, data: Partial<Staff>) -> Promise<ActionState>
      // But useActionState expects (state, payload) -> state.
      // So we need to adapt it or create a new action wrapper.
      // For now, let's assume updateStaff is compatible or we fix it.
      // Actually, looking at actions.ts: export async function updateStaff(staffId: string, data: Partial<Staff>)
      // This is NOT compatible with useActionState directly if we want to use FormData.
      // I should create a specific action for this form or adapt.
      // I'll create a wrapper here or use client-side call.

      // Since updateStaff is defined as (staffId, data), I should call it directly, not via dispatch if it's not a form action.
      // But I want to use useActionState for loading state?
      // No, useActionState is for form actions.
      // I'll just call it directly.
    })
  }

  // Re-implementing onSubmit to call updateStaff directly
  async function handleDirectSubmit(data: EditStaffFormValues) {
      try {
        const updateData: any = {
            name: data.fullName,
            phone: data.phone,
            role: data.role,
        }
        if (data.role === "TECHNICIAN") {
            // We need to pass skill IDs. But Staff type has skills: Skill[].
            // The backend update endpoint expects skill_ids.
            // The frontend updateStaff action takes Partial<Staff>.
            // If I pass skill_ids, it might not match Staff type.
            // I need to check updateStaff implementation.
            // It just sends JSON. So I can cast it.
            updateData.skill_ids = selectedSkills
        }

        const result = await updateStaff(staff.id, updateData)
        if (result.success) {
            showToast.success("Thành công", result.message)
            onOpenChange(false)
        } else {
            showToast.error("Lỗi", result.error)
        }
      } catch (error) {
          showToast.error("Lỗi", "Đã có lỗi xảy ra")
      }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa hồ sơ nhân viên</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin và kỹ năng của nhân viên.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleDirectSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vai trò</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ADMIN">Quản lý</SelectItem>
                      <SelectItem value="RECEPTIONIST">Lễ tân</SelectItem>
                      <SelectItem value="TECHNICIAN">Kỹ thuật viên</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("role") === "TECHNICIAN" && (
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Kỹ năng
                </label>
                <SkillSelector
                  skills={skills}
                  selectedSkillIds={selectedSkills}
                  onSkillsChange={setSelectedSkills}
                />
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
