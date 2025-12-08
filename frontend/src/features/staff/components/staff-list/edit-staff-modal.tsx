"use client"

import { updateStaff, updateStaffSkills, updateUser } from "@/features/staff/actions"
import { StaffUpdateFormValues, staffUpdateSchema } from "@/features/staff/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Save } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

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
import { Form } from "@/shared/ui/form"
import { Staff } from "../../types"
import { StaffForm } from "../staff-form"

interface EditStaffModalProps {
  staff: Staff
  skills: Skill[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditStaffModal({ staff, skills, open, onOpenChange }: EditStaffModalProps) {
  const form = useForm<StaffUpdateFormValues>({
    resolver: zodResolver(staffUpdateSchema),
    defaultValues: {
      full_name: staff.user.full_name || "",
      phone_number: staff.user.phone_number || "",
      role: staff.user.role as "admin" | "receptionist" | "technician",
      title: staff.title || "",
      bio: staff.bio || "",
      color_code: staff.color_code || "#3B82F6",
      skill_ids: staff.skills.map(s => s.id)
    },
  })

  // Reset form when modal opens or staff changes
  useEffect(() => {
    if (open) {
      form.reset({
        full_name: staff.user.full_name || "",
        phone_number: staff.user.phone_number || "",
        role: staff.user.role as "admin" | "receptionist" | "technician",
        title: staff.title || "",
        bio: staff.bio || "",
        color_code: staff.color_code || "#3B82F6",
        skill_ids: staff.skills.map(s => s.id)
      })
    }
  }, [open, staff, form])

  async function handleDirectSubmit(data: StaffUpdateFormValues) {
      try {
        // 1. Update User basic info
        const userUpdateResult = await updateUser(staff.user_id, {
            full_name: data.full_name,
            phone_number: data.phone_number || undefined,
        })

        if (!userUpdateResult.success) {
            showToast.error("Lỗi cập nhật user", userUpdateResult.error)
            return
        }

        // 2. Update Staff Profile (Title, Bio, Color)
        const staffUpdateResult = await updateStaff(staff.user_id, {
            title: data.title,
            bio: data.bio,
            color_code: data.color_code,
        })

         if (!staffUpdateResult.success) {
            showToast.error("Lỗi cập nhật hồ sơ", staffUpdateResult.error)
            return
        }

        // 3. Update Skills (if Technician)
        if (data.role === "technician" && data.skill_ids) {
            const skillUpdateResult = await updateStaffSkills(staff.user_id, data.skill_ids)
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
      <DialogContent className="sm:max-w-[550px] p-0 border-0 shadow-lg rounded-xl flex flex-col max-h-[90vh]">
        <DialogHeader className="px-6 pt-6 pb-2 flex-shrink-0">
          <DialogTitle className="text-xl font-serif font-semibold text-foreground">
            Hồ sơ nhân viên
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Quản lý thông tin cá nhân, vai trò và kỹ năng chuyên môn.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleDirectSubmit)} className="space-y-6 pb-6">
                <StaffForm mode="update" skills={skills} />
            </form>
          </Form>
        </div>

        <DialogFooter className="px-6 py-4 border-t flex-shrink-0 bg-background/50 backdrop-blur-sm rounded-b-xl">
            <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="h-10 hover:bg-muted"
            >
                Hủy bỏ
            </Button>
            <Button
                onClick={form.handleSubmit(handleDirectSubmit)}
                disabled={form.formState.isSubmitting}
                className="h-10 min-w-[120px]"
            >
                {form.formState.isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                <Save className="mr-2 h-4 w-4" />
                )}
                Lưu hồ sơ
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
