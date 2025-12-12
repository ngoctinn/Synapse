"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Save, Send } from "lucide-react"
import * as React from "react"
import { useForm } from "react-hook-form"


import { Skill } from "@/features/services/types"
import { manageStaff } from "@/features/staff/actions"
import {
    StaffCreateFormValues,
    StaffUpdateFormValues,
    staffCreateSchema,
    staffUpdateSchema
} from "@/features/staff/model/schemas"
import { Staff } from "@/features/staff/model/types"


import { Button } from "@/shared/ui/button"
import { showToast } from "@/shared/ui/custom/sonner"
import { Form } from "@/shared/ui/form"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle
} from "@/shared/ui/sheet"
import { StaffForm } from "./staff-form"

interface StaffSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "update"
  staff?: Staff
  skills: Skill[]
}

// ... imports

export function StaffSheet({ open, onOpenChange, mode, staff, skills }: StaffSheetProps) {
  const [state, dispatch, isPending] = React.useActionState(manageStaff, undefined)


  const schema = mode === "create" ? staffCreateSchema : staffUpdateSchema

  const form = useForm<StaffCreateFormValues | StaffUpdateFormValues>({
    resolver: zodResolver(schema),
    disabled: isPending,
    defaultValues: {
      email: "",
      full_name: "",
      role: "technician",
      title: "",
      skill_ids: [],
    },
  })


  React.useEffect(() => {
    if (state?.status === "success" && state.message) {
      showToast.success(mode === "create" ? "Đã gửi lời mời" : "Cập nhật thành công", state.message)
      onOpenChange(false)
    } else if (state?.status === "error") {
      showToast.error("Thất bại", state.message)
    }
  }, [state, mode, onOpenChange])


  React.useEffect(() => {
    if (open) {
      form.reset(mode === "create" ? {
        email: "",
        full_name: "",
        role: "technician",
        title: "",
        skill_ids: [],
      } : {
        full_name: staff?.user.full_name || "",
        phone_number: staff?.user.phone_number || "",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        role: staff?.user.role as any,
        title: staff?.title || "",
        bio: staff?.bio || "",
        color_code: staff?.color_code || "#3B82F6",
        skill_ids: staff?.skills.map(s => s.id) || [],
        hired_at: staff?.hired_at ? staff.hired_at.split("T")[0] : "", // Simple date format
        commission_rate: staff?.commission_rate || 0,
      })
    }
  }, [open, mode, staff, form])


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onSubmit(data: any) {
    const formData = new FormData()

    formData.append("form_mode", mode)
    if (staff?.user_id) formData.append("staff_id", staff.user_id)


    Object.entries(data).forEach(([key, value]) => {
      if (key === 'skill_ids') {
        formData.append(key, JSON.stringify(value))
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as string)
      }
    })

    React.startTransition(() => {
        dispatch(formData)
    })
  }

  return (
    <Sheet open={open} onOpenChange={(val) => !isPending && onOpenChange(val)}>
      <SheetContent className="w-full sm:max-w-md p-0 gap-0 flex flex-col bg-background border-l shadow-2xl">
        <SheetHeader>
            <div className="flex items-center justify-between">
                <SheetTitle className="text-xl font-semibold text-foreground">
                    {mode === "create" ? "Mời nhân viên" : "Hồ sơ nhân viên"}
                </SheetTitle>
            </div>
            <SheetDescription className="text-muted-foreground text-sm">
                {mode === "create"
                    ? "Tạo tài khoản mới và gửi email mời tham gia hệ thống."
                    : "Quản lý thông tin cá nhân, vai trò và chuyên môn."}
            </SheetDescription>
        </SheetHeader>

        <div className="sheet-scroll-area" id="sheet-scroll-container">
            <Form {...form}>
                <form id="staff-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <StaffForm mode={mode} skills={skills} />
                </form>
            </Form>
        </div>

        <SheetFooter>
            <Button
                type="button"
                variant="ghost"
                onClick={() => !isPending && onOpenChange(false)}
                disabled={isPending}
                className="text-muted-foreground hover:text-foreground"
            >
                Hủy bỏ
            </Button>
            <Button
                type="submit"
                form="staff-form"
                disabled={isPending}
                className="min-w-[140px]"
                isLoading={isPending}
                startContent={mode === "create" ? <Send className="size-4" /> : <Save className="size-4" />}
            >
                {mode === "create" ? "Gửi lời mời" : "Lưu thay đổi"}
            </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
