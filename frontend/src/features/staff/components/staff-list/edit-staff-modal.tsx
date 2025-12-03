"use client"

import { updateStaffSkills, updateUser } from "@/features/staff/actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
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
  phone: z.string().min(10, "Số điện thoại không hợp lệ").optional().or(z.literal("")),
  role: z.enum(["admin", "receptionist", "technician"]),
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
      fullName: staff.user.full_name || "",
      phone: staff.user.phone_number || "",
      role: staff.user.role as "admin" | "receptionist" | "technician",
    },
  })

  // Initialize skills when modal opens or staff changes
  useEffect(() => {
    if (open) {
      form.reset({
        fullName: staff.user.full_name || "",
        phone: staff.user.phone_number || "",
        role: staff.user.role as "admin" | "receptionist" | "technician",
      })
      setSelectedSkills(staff.skills.map(s => s.id))
    }
  }, [open, staff, form])

  async function handleDirectSubmit(data: EditStaffFormValues) {
      try {
        // 1. Update User Info (Name, Phone)
        const userUpdateResult = await updateUser(staff.user_id, {
            full_name: data.fullName,
            phone_number: data.phone || undefined,
        })

        if (!userUpdateResult.success) {
            showToast.error("Lỗi cập nhật thông tin", userUpdateResult.error)
            return
        }

        // 2. Update Skills (if Technician)
        if (data.role === "technician") {
            const skillUpdateResult = await updateStaffSkills(staff.user_id, selectedSkills)
            if (!skillUpdateResult.success) {
                showToast.error("Lỗi cập nhật kỹ năng", skillUpdateResult.error)
                return
            }
        }

        showToast.success("Thành công", "Đã cập nhật hồ sơ nhân viên")
        onOpenChange(false)

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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={true} // Disable role editing for now
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                    </FormControl>
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

            {form.watch("role") === "technician" && (
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
