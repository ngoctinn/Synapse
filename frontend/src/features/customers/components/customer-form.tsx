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
import { Textarea } from "@/shared/ui/textarea"
import { Activity, AlertCircle, Mail, MapPin, Phone, User } from "lucide-react"
import { useFormContext } from "react-hook-form"

interface CustomerFormProps {
  mode: "create" | "update"
  className?: string
}

export function CustomerForm({ mode, className }: CustomerFormProps) {
  const form = useFormContext()

  return (
    <div className={cn("space-y-6", className)}>
       {mode === "update" && (
            <FormField
                control={form.control}
                name="user_id"
                render={({ field }) => (
                    <input type="hidden" {...field} />
                )}
            />
       )}
       {/* Premium Avatar Upload UI */}
       <div className="flex items-start gap-5 p-4 border rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors group">
         <div className="relative">
             <div className="size-16 rounded-full bg-background flex items-center justify-center border-2 border-dashed border-muted-foreground/20 group-hover:border-primary/50 transition-all shadow-sm overflow-hidden">
                 {mode === "update" ? (
                     <User className="size-8 text-muted-foreground/40" />
                 ) : (
                     <User className="size-8 text-muted-foreground/40" />
                 )}
             </div>
             <button
                type="button"
                className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-primary text-primary-foreground shadow-md hover:scale-110 transition-transform"
                title="Tải ảnh lên"
             >
                 <User className="size-3" />
             </button>
         </div>
         <div className="flex-1 space-y-1 py-1">
             <div className="flex items-center justify-between">
                 <p className="text-sm font-medium text-foreground">Ảnh đại diện</p>
                 <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium border border-yellow-200">Sắp ra mắt</span>
             </div>
             <p className="text-xs text-muted-foreground leading-relaxed">
                 Tải lên ảnh chân dung rõ nét để nhận diện khách hàng.<br/>
                 Hỗ trợ JPG, PNG (Max 5MB).
             </p>
         </div>
      </div>

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
                                    value={field.value && !isNaN(Date.parse(field.value)) ? new Date(field.value) : undefined}
                                    onChange={(date) => {
                                        if (date) {
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

      <div className="h-[1px] bg-border/40 w-full" />

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground/90">Thông tin Y tế & Sức khỏe</h3>
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
                    className="resize-none min-h-[80px] bg-red-50/30 border-red-100 focus:border-red-300 focus:ring-red-200/50"
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
                Ghi chú y tế
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
    </div>
  )
}
