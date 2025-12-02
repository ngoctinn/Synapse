"use client"

import { inviteStaff } from "@/features/staff/actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Mail } from "lucide-react"
import * as React from "react"
import { useActionState, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/shared/ui/button"
import { showToast } from "@/shared/ui/custom/sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { SkillSelector } from "./skill-selector"
import { Skill } from "@/features/services/types"

const inviteStaffSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  fullName: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  role: z.enum(["ADMIN", "RECEPTIONIST", "TECHNICIAN"]),
})

type InviteStaffFormValues = z.infer<typeof inviteStaffSchema>

const initialState = {
  success: false,
  message: "",
  error: "",
}

interface InviteStaffModalProps {
  skills: Skill[]
}

export function InviteStaffModal({ skills }: InviteStaffModalProps) {
  const [open, setOpen] = useState(false)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [state, dispatch, isPending] = useActionState(inviteStaff, initialState)

  const form = useForm<InviteStaffFormValues>({
    resolver: zodResolver(inviteStaffSchema),
    defaultValues: {
      email: "",
      fullName: "",
      phone: "",
      role: "TECHNICIAN",
    },
  })

  React.useEffect(() => {
    if (state.success) {
      showToast.success("Thành công", state.message)
      setOpen(false)
      form.reset()
      setSelectedSkills([])
    } else if (state.error) {
      showToast.error("Lỗi", state.error)
    }
  }, [state, form])

  function onSubmit(data: InviteStaffFormValues) {
    const formData = new FormData()
    formData.append("email", data.email)
    formData.append("fullName", data.fullName)
    formData.append("phone", data.phone)
    formData.append("role", data.role)

    // Append skills if role is Technician
    if (data.role === "TECHNICIAN" && selectedSkills.length > 0) {
        formData.append("skill_ids", JSON.stringify(selectedSkills))
    }

    React.startTransition(() => {
      dispatch(formData)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-9 text-xs shadow-sm">
          <Mail className="mr-2 h-3.5 w-3.5" />
          Mời nhân viên
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Mời nhân viên mới</DialogTitle>
          <DialogDescription>
            Gửi email mời nhân viên tham gia hệ thống. Họ sẽ tự thiết lập mật khẩu.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="staff@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nguyễn Văn A" {...field} />
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
                    <Input placeholder="0901234567" {...field} />
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
                  Kỹ năng (Tùy chọn)
                </label>
                <SkillSelector
                  skills={skills}
                  selectedSkillIds={selectedSkills}
                  onSkillsChange={setSelectedSkills}
                />
                <p className="text-[0.8rem] text-muted-foreground">
                  Chọn các kỹ năng mà nhân viên này có thể thực hiện.
                </p>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Gửi lời mời
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
