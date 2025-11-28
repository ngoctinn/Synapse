"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/shared/ui/button"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { staffFormSchema, StaffFormValues } from "../../schemas"

// Mock skills for selection
const AVAILABLE_SKILLS = [
  "Facial",
  "Massage Body",
  "Massage Cổ Vai Gáy",
  "Nặn mụn",
  "Gội đầu",
  "Tắm trắng",
  "Triệt lông",
  "Laser",
  "Peel da",
]

export function StaffModal() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("account")

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "RECEPTIONIST",
      name: "",
      phone: "",
      address: "",
      skills: [],
    } as StaffFormValues,
  })

  const role = form.watch("role")

  function onSubmit(data: StaffFormValues) {
    console.log(data)
    // TODO: Handle submit (create staff)
    setOpen(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm nhân viên
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
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account">Tài khoản</TabsTrigger>
                <TabsTrigger value="profile">Hồ sơ</TabsTrigger>
              </TabsList>

              <TabsContent value="account" className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email đăng nhập</FormLabel>
                      <FormControl>
                        <Input placeholder="email@synapse.com" {...field} />
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
                        <Input type="password" placeholder="******" {...field} />
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
                          <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                          <SelectItem value="RECEPTIONIST">Lễ tân</SelectItem>
                          <SelectItem value="TECHNICIAN">Kỹ thuật viên</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="profile" className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
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

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                          <Input placeholder="090..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ</FormLabel>
                        <FormControl>
                          <Input placeholder="TP.HCM" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {role === "TECHNICIAN" && (
                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kỹ năng chuyên môn</FormLabel>
                        <div className="grid grid-cols-2 gap-2 border rounded-md p-4 max-h-[200px] overflow-y-auto">
                          {AVAILABLE_SKILLS.map((skill) => (
                            <div key={skill} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`skill-${skill}`}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                checked={field.value?.includes(skill)}
                                onChange={(e) => {
                                  const checked = e.target.checked
                                  const current = field.value || []
                                  if (checked) {
                                    field.onChange([...current, skill])
                                  } else {
                                    field.onChange(current.filter((v) => v !== skill))
                                  }
                                }}
                              />
                              <label
                                htmlFor={`skill-${skill}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {skill}
                              </label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button type="submit">Lưu nhân viên</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
