"use client"

import { inviteStaff } from "@/features/staff/actions"
import { inviteStaffSchema } from "@/features/staff/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { Briefcase, Loader2, Mail, Send, Shield, User } from "lucide-react"
import * as React from "react"
import { useActionState, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Skill } from "@/features/services/types"
import { Button } from "@/shared/ui/button"
import { InputWithIcon } from "@/shared/ui/custom/input-with-icon"
import { showToast } from "@/shared/ui/custom/sonner"
import { TagInput } from "@/shared/ui/custom/tag-input"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select"

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
      full_name: "",
      title: "",
      role: "technician",
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
    formData.append("full_name", data.full_name)
    formData.append("title", data.title)
    formData.append("role", data.role)

    // Append skills if role is Technician
    if (data.role === "technician" && selectedSkills.length > 0) {
        formData.append("skill_ids", JSON.stringify(selectedSkills))
    }

    React.startTransition(() => {
      dispatch(formData)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-9 text-xs shadow-md shadow-primary/20 rounded-lg bg-primary hover:bg-primary/90 transition-all duration-300">
          <Mail className="mr-2 h-3.5 w-3.5" />
          Mời nhân viên
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] p-0 border-0 shadow-lg rounded-xl">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-serif font-semibold text-foreground">Mời nhân viên mới</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Điền thông tin để gửi lời mời tham gia hệ thống.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 pt-2">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid gap-5 py-2">
                    {/* Basic Info Group */}
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="text-foreground/80 font-normal">Email liên hệ</FormLabel>
                                <FormControl>
                                    <InputWithIcon
                                        icon={Mail}
                                        placeholder="staff@example.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
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
                                        />
                                    </FormControl>
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
                                            placeholder="VD: Chuyên viên"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="h-[1px] bg-border/50 my-1" />

                    {/* Role & Skills Group */}
                    <div className="space-y-4">
                        <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="text-foreground/80 font-normal">Vai trò hệ thống</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger className="h-11 rounded-xl bg-background border-muted-foreground/20 focus:border-primary/50 transition-all">
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-muted-foreground" />
                                        <SelectValue placeholder="Chọn vai trò" />
                                    </div>
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
                        <div className="space-y-2 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2 duration-300">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground/80 font-normal">
                            Kỹ năng chuyên môn
                            </label>
                            <div className="p-3 bg-muted/20 border border-muted-foreground/10 rounded-xl">
                                <TagInput
                                  options={skills.map(s => ({ id: s.id, label: s.name }))}
                                  selectedIds={selectedSkills}
                                  newTags={[]}
                                  onSelectedChange={setSelectedSkills}
                                  onNewTagsChange={() => {}}
                                  placeholder="Chọn kỹ năng..."
                                />
                            </div>
                            <p className="text-[0.8rem] text-muted-foreground flex items-center gap-1">
                                <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                                Chọn các dịch vụ nhân viên này có thể thực hiện
                            </p>
                        </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t mt-4">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpen(false)}
                    className="rounded-lg h-10 hover:bg-muted"
                >
                    Hủy bỏ
                </Button>
                <Button
                    type="submit"
                    disabled={isPending}
                    className="rounded-lg h-10 shadow-lg shadow-primary/25 min-w-[120px]"
                >
                    {isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Send className="mr-2 h-4 w-4" />
                    )}
                    Gửi lời mời
                </Button>
                </DialogFooter>
            </form>
            </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
