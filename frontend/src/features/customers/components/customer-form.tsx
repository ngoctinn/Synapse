"use client"

import { cn } from "@/shared/lib/utils"
import { OptionalMark, RequiredMark } from "@/shared/ui"
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
import { useFormContext } from "react-hook-form"

// Type cho danh sách KTV được truyền từ parent
export type TechnicianOption = {
  id: string
  name: string
}

interface CustomerFormProps {
  mode: "create" | "update"
  className?: string
  disabled?: boolean
  /** Danh sách kỹ thuật viên cho dropdown "Chuyên viên ưu tiên" */
  technicians?: TechnicianOption[]
}


export function CustomerForm({ mode, className, disabled, technicians = [] }: CustomerFormProps) {
  const form = useFormContext()

  // --- Sub-render functions (Extracted for readability) ---
  const renderProfile = () => (
    <div className="space-y-6">
       {/* Premium Avatar Upload UI */}


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
            <FormItem>
                <FormLabel>
                    Số điện thoại <RequiredMark />
                </FormLabel>
                <FormControl>
                <Input
                    type="tel"
                    placeholder="0912 345 678"
                    autoFocus={mode === "create"}
                    disabled={disabled}
                    {...field}
                    className="font-medium"
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
                <FormLabel>
                    Họ và tên <RequiredMark />
                </FormLabel>
                <FormControl>
                    <Input
                    placeholder="Nguyễn Văn A"
                    disabled={disabled}
                    {...field}
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
                  <FormLabel>Giới tính</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={disabled}
                  >
                    <SelectTrigger>
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
                        <FormLabel>Ngày sinh</FormLabel>
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
                                disabled={disabled}
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
                <FormLabel>
                    Email <OptionalMark />
                </FormLabel>
                <FormControl>
                <Input
                    type="email"
                    placeholder="email@example.com"
                    disabled={disabled}
                    {...field}
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
                <FormLabel>Địa chỉ</FormLabel>
                <FormControl>
                <Input
                    placeholder="Số nhà, đường..."
                    disabled={disabled}
                    {...field}
                />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
    </div>
  )

  const renderHealth = () => (
    <div className="space-y-6">


        <FormField
            control={form.control}
            name="allergies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                    Tiền sử dị ứng
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Liệt kê: Hải sản, Phấn hoa, Thuốc kháng sinh..."
                    disabled={disabled}
                    className="resize-none min-h-[100px] border-destructive/30 focus:border-destructive focus:ring-destructive/20 disabled:opacity-50"
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
              <FormLabel>
                  Ghi chú y tế & Thai sản
              </FormLabel>
              <FormControl>
                  <Textarea
                  placeholder="Bệnh nền, tình trạng sức khỏe, đang mang thai (tháng thứ mấy)..."
                  disabled={disabled}
                  className="resize-none min-h-[120px]"
                  {...field}
                  />
              </FormControl>
              <FormMessage />
              </FormItem>
          )}
        />
    </div>
  )

  const renderMembership = () => (
    <div className="space-y-6">


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <FormField
              control={form.control}
              name="membership_tier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hạng thành viên</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || "SILVER"}
                    disabled={disabled || mode === "create"}
                  >
                    <SelectTrigger>
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
                    <FormLabel>Điểm tích lũy</FormLabel>
                    <FormControl>
                        <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        disabled={disabled}
                        {...field}
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
                  <FormLabel>Chuyên viên ưu tiên (Nếu có)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || undefined}
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn nhân viên yêu thích" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">Không có ưu tiên</SelectItem>
                        {technicians.map((tech) => (
                          <SelectItem key={tech.id} value={tech.id}>
                            {tech.name}
                          </SelectItem>
                        ))}
                        {technicians.length === 0 && (
                          <SelectItem value="_loading" disabled>
                            Đang tải danh sách...
                          </SelectItem>
                        )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
        />
    </div>
  )

  // --- Main Render ---
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

      {mode === "create" ? (
        <div className="space-y-6 pt-2">
            <div className="space-y-4">
                <h3 className="font-semibold text-base">Hồ sơ cá nhân</h3>
                {renderProfile()}
            </div>

            <div className="space-y-4">
                <div className="border-t pt-4">
                     <h3 className="font-semibold text-base">Thông tin sức khỏe</h3>
                </div>
                {renderHealth()}
            </div>

            <div className="space-y-4">
                <div className="border-t pt-4">
                    <h3 className="font-semibold text-base">Thành viên & Tích lũy</h3>
                </div>
                {renderMembership()}
            </div>
        </div>
      ) : (
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">
                Hồ sơ
              </TabsTrigger>
              <TabsTrigger value="health">
                Sức khỏe
              </TabsTrigger>
              <TabsTrigger value="membership">
                Thành viên
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-4 border-none p-0">
               {renderProfile()}
            </TabsContent>

            <TabsContent value="health" className="mt-4 border-none p-0">
               {renderHealth()}
            </TabsContent>

            <TabsContent value="membership" className="mt-4 border-none p-0">
               {renderMembership()}
            </TabsContent>
          </Tabs>
      )}
    </div>
  )
}

