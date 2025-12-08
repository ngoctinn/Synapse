"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Save, Send } from "lucide-react"
import * as React from "react"
import { useForm } from "react-hook-form"

// Actions & Schemas
import { Skill } from "@/features/services/types"
import { manageStaff } from "@/features/staff/actions"
import {
  StaffCreateFormValues,
  StaffUpdateFormValues,
  staffCreateSchema,
  staffUpdateSchema
} from "@/features/staff/schemas"
import { Staff } from "@/features/staff/types"

// Components
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

const initialState = {
    success: false,
    message: "",
    error: "",
}

export function StaffSheet({ open, onOpenChange, mode, staff, skills }: StaffSheetProps) {
  const [state, dispatch, isPending] = React.useActionState(manageStaff, initialState)

  // Dynamic Schema & Default Values
  const schema = mode === "create" ? staffCreateSchema : staffUpdateSchema

  const form = useForm<StaffCreateFormValues | StaffUpdateFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      full_name: "",
      role: "technician",
      title: "",
      skill_ids: [],
    },
  })

  // Toast effect based on Action State
  React.useEffect(() => {
    if (state.success && state.message) {
      showToast.success(mode === "create" ? "Đã gửi lời mời" : "Cập nhật thành công", state.message)
      onOpenChange(false)
    } else if (state.error) {
      showToast.error("Thất bại", state.error)
    }
  }, [state, mode, onOpenChange])

  // Reset form when opening/mode changes - optimized
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
        role: staff?.user.role as any,
        title: staff?.title || "",
        bio: staff?.bio || "",
        color_code: staff?.color_code || "#3B82F6",
        skill_ids: staff?.skills.map(s => s.id) || [],
      })
    }
  }, [open, mode, staff, form])


  function onSubmit(data: any) {
    const formData = new FormData()
    // Append meta fields
    formData.append("form_mode", mode)
    if (staff?.user_id) formData.append("staff_id", staff.user_id)

    // Append data fields
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl p-0 gap-0 flex flex-col bg-background border-l shadow-2xl">
        <SheetHeader className="px-6 py-4 border-b">
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

        <div className="flex-1 overflow-y-auto px-6 py-6 [scrollbar-gutter:stable]">
            <Form {...form}>
                <form id="staff-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <StaffForm mode={mode} skills={skills} />
                </form>
            </Form>
        </div>

        <SheetFooter className="px-6 py-4 border-t sm:justify-between flex-row items-center gap-4 bg-background">
            <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="text-muted-foreground hover:text-foreground"
            >
                Hủy bỏ
            </Button>
            <Button
                type="submit"
                form="staff-form"
                disabled={isPending}
                className="min-w-[140px] shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
            >
                {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : mode === "create" ? (
                    <>
                        <Send className="mr-2 h-4 w-4" /> Gửi lời mời
                    </>
                ) : (
                    <>
                        <Save className="mr-2 h-4 w-4" /> Lưu thay đổi
                    </>
                )}
            </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
