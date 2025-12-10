"use client"

import { cn } from "@/shared/lib/utils"
import { DatePicker } from "@/shared/ui/custom/date-picker"
import { InputWithIcon } from "@/shared/ui/custom/input-with-icon"
import { SelectWithIcon } from "@/shared/ui/custom/select-with-icon"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Textarea } from "@/shared/ui/textarea"
import { Activity, AlertCircle, Mail, MapPin, Phone, User } from "lucide-react"
import { useFormContext } from "react-hook-form"

interface CustomerFormProps {
  mode: "create" | "update"
  className?: string
}

export function CustomerForm({ mode, className }: CustomerFormProps) {
  const form = useFormContext()

  const PersonalInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className="bg-background h-10"
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />

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
                    className="h-10 bg-background"
                />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
      </div>

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
                    className="bg-background h-10"
                />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80 font-normal">Giới tính</FormLabel>
                  <SelectWithIcon
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    icon={User}
                    placeholder="Chọn giới tính"
                    options={[
                      { label: "Nam", value: "MALE" },
                      { label: "Nữ", value: "FEMALE" },
                      { label: "Khác", value: "OTHER" },
                    ]}
                     className="bg-background h-10"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

             <FormField
                control={form.control}
                name="date_of_birth"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-foreground/80 font-normal">Ngày sinh</FormLabel>
                        <FormControl>
                            <DatePicker
                                value={field.value ? new Date(field.value) : undefined}
                                onChange={(date) => {
                                    if (date) {
                                        // Format as YYYY-MM-DD for backend consistency
                                        const year = date.getFullYear()
                                        const month = String(date.getMonth() + 1).padStart(2, "0")
                                        const day = String(date.getDate()).padStart(2, "0")
                                        field.onChange(`${year}-${month}-${day}`)
                                    } else {
                                        field.onChange("")
                                    }
                                }}
                                className="h-10"
                                placeholder="DD/MM/YYYY"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
      </div>

       <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
            <FormItem>
                <FormLabel className="text-foreground/80 font-normal">Địa chỉ</FormLabel>
                <FormControl>
                <InputWithIcon
                    icon={MapPin}
                    placeholder="Số nhà, đường..."
                    {...field}
                    className="bg-background h-10"
                />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
    </div>
  )

  const HealthInfo = () => (
    <div className="space-y-4">
        <FormField
            control={form.control}
            name="allergies"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/80 font-normal text-destructive flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Tiền sử dị ứng
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Liệt kê các loại thuốc, mỹ phẩm, thực phẩm gây dị ứng..."
                    className="resize-none min-h-[80px] bg-red-50/50 border-red-100 focus:border-red-300 focus:ring-red-200"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
        />

        <FormField
        control={form.control}
        name="medical_notes"
        render={({ field }) => (
            <FormItem>
            <FormLabel className="text-foreground/80 font-normal flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                Ghi chú y tế & Sức khỏe
            </FormLabel>
            <FormControl>
                <Textarea
                placeholder="Bệnh nền, tình trạng sức khỏe hiện tại, đang mang thai..."
                className="resize-none min-h-[100px] bg-background"
                {...field}
                />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />
    </div>
  )

  return (
    <div className={cn("w-full", className)}>
        <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="personal">Thông tin cá nhân</TabsTrigger>
                <TabsTrigger value="health">Sức khỏe & Y tế</TabsTrigger>
            </TabsList>
            <TabsContent value="personal" className="space-y-4">
                <PersonalInfo />
            </TabsContent>
            <TabsContent value="health" className="space-y-4">
                <HealthInfo />
            </TabsContent>
        </Tabs>
    </div>
  )
}
