"use client"

import { cn } from "@/shared/lib/utils"
import { DatePicker } from "@/shared/ui/custom/date-picker"
import {
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
import { Textarea } from "@/shared/ui/textarea"
import { Activity, AlertCircle, Crown, Heart, Mail, MapPin, Phone, Star, User } from "lucide-react"
import { useFormContext } from "react-hook-form"

interface CustomerFormProps {
  mode: "create" | "update"
  className?: string
}


export function CustomerForm({ mode, className }: CustomerFormProps) {
  const form = useFormContext()

  return (
    <div className={cn("space-y-4", className)}>
       {mode === "update" && (
            <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                    <input type="hidden" {...field} />
                )}
            />
       )}

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Hồ sơ
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center gap-2 data-[state=active]:text-red-600 data-[state=active]:bg-red-50">
            <Activity className="h-4 w-4" />
            Sức khỏe
          </TabsTrigger>
          <TabsTrigger value="membership" className="flex items-center gap-2 data-[state=active]:text-amber-600 data-[state=active]:bg-amber-50">
            <Crown className="h-4 w-4" />
            Thành viên
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: GENERAL INFO */}
        <TabsContent value="general" className="space-y-6 animate-in fade-in-50 duration-300">
           {/* Premium Avatar Upload UI */}
           <div className="flex items-start gap-5 p-4 border rounded-xl bg-card hover:bg-accent/5 transition-colors group">
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
                 </div>
                 <p className="text-xs text-muted-foreground leading-relaxed">
                     Tải lên ảnh chân dung rõ nét để nhận diện khách hàng.
                 </p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-foreground/80 font-normal">
                        Số điện thoại <span className="text-red-500 ml-0.5">*</span>
                    </FormLabel>
                    <FormControl>
                    <Input
                        startContent={<Phone size={18} />}
                        type="tel"
                        placeholder="0912 345 678"
                        autoFocus={mode === "create"}
                        {...field}
                        className="h-10 bg-background font-medium"
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-foreground/80 font-normal">
                        Họ và tên <span className="text-red-500 ml-0.5">*</span>
                    </FormLabel>
                    <FormControl>
                        <Input
                        startContent={<User size={18} />}
                        placeholder="Nguyễn Văn A"
                        {...field}
                        className="bg-background h-10"
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80 font-normal">Giới tính</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-background h-10" startContent={<User size={18} />}>
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">Nam</SelectItem>
                          <SelectItem value="FEMALE">Nữ</SelectItem>
                          <SelectItem value="OTHER">Khác</SelectItem>
                        </SelectContent>
                      </Select>
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
                name="email"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-foreground/80 font-normal">
                        Email <span className="text-muted-foreground font-normal text-xs ml-1">(Tùy chọn)</span>
                    </FormLabel>
                    <FormControl>
                    <Input
                        startContent={<Mail size={18} />}
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

           <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-foreground/80 font-normal">Địa chỉ</FormLabel>
                    <FormControl>
                    <Input
                        startContent={<MapPin size={18} />}
                        placeholder="Số nhà, đường..."
                        {...field}
                        className="bg-background h-10"
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </TabsContent>

        {/* TAB 2: HEALTH */}
        <TabsContent value="health" className="space-y-6 animate-in fade-in-50 duration-300">
           <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 flex gap-4">
              <div className="p-2 bg-red-100 rounded-full h-fit text-red-600">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-red-900">Lưu ý Sức khỏe</h4>
                <p className="text-xs text-red-700 mt-1">
                  Thông tin này rất quan trọng để đảm bảo an toàn cho khách hàng trong quá trình sử dụng dịch vụ.
                  Vui lòng kiểm tra kỹ tiền sử dị ứng.
                </p>
              </div>
           </div>

            <FormField
                control={form.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80 font-normal flex items-center gap-2 text-red-600 font-semibold">
                        <AlertCircle className="w-4 h-4" />
                        Tiền sử dị ứng
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Liệt kê: Hải sản, Phấn hoa, Thuốc kháng sinh..."
                        className="resize-none min-h-[100px] border-red-200 focus:border-red-400 focus:ring-red-100"
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
                    Ghi chú y tế & Thai sản
                </FormLabel>
                <FormControl>
                    <Textarea
                    placeholder="Bệnh nền, tình trạng sức khỏe, đang mang thai (tháng thứ mấy)..."
                    className="resize-none min-h-[120px]"
                    {...field}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </TabsContent>

        {/* TAB 3: MEMBERSHIP & POINTS */}
        <TabsContent value="membership" className="space-y-6 animate-in fade-in-50 duration-300">
             <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 flex gap-4">
                <div className="p-2 bg-amber-100 rounded-full h-fit text-amber-600">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-amber-900">Hạng thành viên & Tích lũy</h4>
                  <p className="text-xs text-amber-700 mt-1">
                    Quản lý hạng thẻ và điểm thưởng của khách hàng.
                  </p>
                </div>
             </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField
                  control={form.control}
                  name="membership_tier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80 font-normal">Hạng thành viên</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || "SILVER"}
                        disabled={mode === "create"} // Disable on create if needed
                      >
                        <SelectTrigger className="bg-background h-10" startContent={<Crown size={18} className="text-amber-500"/>}>
                          <SelectValue placeholder="Chọn hạng thẻ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SILVER">Silver Member</SelectItem>
                          <SelectItem value="GOLD">Gold Member</SelectItem>
                          <SelectItem value="PLATINUM">Platinum Member</SelectItem>
                        </SelectContent>
                      </Select>
                       {mode === "create" && <p className="text-[10px] text-muted-foreground">Mặc định là Silver cho khách mới.</p>}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                 <FormField
                    control={form.control}
                    name="loyalty_points"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-foreground/80 font-normal">Điểm tích lũy</FormLabel>
                        <FormControl>
                            <Input
                            startContent={<Star size={18} className="text-yellow-500" />}
                            type="number"
                            min="0"
                            placeholder="0"
                            {...field}
                            className="bg-background h-10"
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                  control={form.control}
                  name="preferred_staff_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80 font-normal">Chuyên viên ưu tiên (Nếu có)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || undefined}
                      >
                        <SelectTrigger className="bg-background h-10" startContent={<Heart size={18} className="text-rose-400"/>}>
                          <SelectValue placeholder="Chọn nhân viên yêu thích" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Không có ưu tiên</SelectItem>
                            {/* Mock staff data - in real app fetch from API */}
                           <SelectItem value="staff_1">Nguyễn Thị KTV</SelectItem>
                           <SelectItem value="staff_2">Trần Văn Senior</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
            />
        </TabsContent>
      </Tabs>
    </div>
  )
}

