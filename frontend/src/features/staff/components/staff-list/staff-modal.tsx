"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Lock, Mail, Plus, User } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { Skill } from "@/features/services/types"
import { Button } from "@/shared/ui/button"
import { InputWithIcon } from "@/shared/ui/custom/input-with-icon"
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
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group"
import { staffFormSchema, StaffFormValues } from "../../schemas"

interface StaffModalProps {
  skills: Skill[]
}

export function StaffModal({ skills }: StaffModalProps) {
  const [open, setOpen] = useState(false)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "receptionist",
      name: "",
      phone: "",
      address: "",
      skills: [],
    } as StaffFormValues,
  })

  // Reset selected skills when modal opens or form resets
  // This is a simplification; in real edit mode, we'd load existing skills

  function onSubmit(data: StaffFormValues) {
    // TODO: Handle submit (create staff) - include selectedSkills in submission
    setOpen(false)
    form.reset()
    setSelectedSkills([])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Thêm nhân viên</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Thêm nhân viên mới</DialogTitle>
          <DialogDescription>
            Tạo tài khoản và thiết lập hồ sơ cho nhân viên mới.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <InputWithIcon icon={User} placeholder="Nguyễn Văn A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email đăng nhập</FormLabel>
                  <FormControl>
                    <InputWithIcon icon={Mail} placeholder="email@synapse.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <InputWithIcon icon={Lock} type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Vai trò</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row gap-4"
                    >
                      <FormItem className="flex items-center space-y-0">
                        <FormControl>
                          <RadioGroupItem value="admin" id="r-admin" className="peer sr-only" />
                        </FormControl>
                        <FormLabel
                          htmlFor="r-admin"
                          className="flex flex-1 items-center justify-center rounded-md border-2 border-muted bg-transparent px-3 py-2 text-sm font-medium ring-offset-background transition-all hover:bg-muted hover:text-muted-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer"
                        >
                          Quản trị viên
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-y-0">
                        <FormControl>
                          <RadioGroupItem value="receptionist" id="r-receptionist" className="peer sr-only" />
                        </FormControl>
                        <FormLabel
                          htmlFor="r-receptionist"
                          className="flex flex-1 items-center justify-center rounded-md border-2 border-muted bg-transparent px-3 py-2 text-sm font-medium ring-offset-background transition-all hover:bg-muted hover:text-muted-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer"
                        >
                          Lễ tân
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-y-0">
                        <FormControl>
                          <RadioGroupItem value="technician" id="r-technician" className="peer sr-only" />
                        </FormControl>
                        <FormLabel
                          htmlFor="r-technician"
                          className="flex flex-1 items-center justify-center rounded-md border-2 border-muted bg-transparent px-3 py-2 text-sm font-medium ring-offset-background transition-all hover:bg-muted hover:text-muted-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer"
                        >
                          Kỹ thuật viên
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}

            />

            {form.watch("role") === "technician" && (
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Kỹ năng
                </label>
                <TagInput
                  options={skills.map(s => ({ id: s.id, label: s.name }))}
                  selectedIds={selectedSkills}
                  newTags={[]}
                  onSelectedChange={setSelectedSkills}
                  onNewTagsChange={() => {}}
                  placeholder="Chọn kỹ năng..."
                />
              </div>
            )}

            <DialogFooter className="pt-4">
              <Button type="submit">Tạo tài khoản</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
