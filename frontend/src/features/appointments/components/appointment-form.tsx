"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { appointmentSchema, AppointmentFormValues } from "../schemas"
import { Button } from "@/shared/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form"
import { Input } from "@/shared/ui/input"
import { Textarea } from "@/shared/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { Calendar } from "@/shared/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { cn } from "@/shared/lib/utils"

interface AppointmentFormProps {
  defaultValues?: Partial<AppointmentFormValues>
  onSubmit: (values: AppointmentFormValues) => void
  onCancel: () => void
  readOnly?: boolean
  onEdit?: () => void
}

export function AppointmentForm({ 
  defaultValues, 
  onSubmit, 
  onCancel,
  readOnly,
  onEdit 
}: AppointmentFormProps) {
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: defaultValues || {
      date: new Date(),
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Khách hàng</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={readOnly}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn khách hàng" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Nguyễn Văn A</SelectItem>
                  <SelectItem value="2">Lê Thị C</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="serviceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dịch vụ</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={readOnly}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn dịch vụ" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Cắt tóc nam</SelectItem>
                    <SelectItem value="2">Gội đầu dưỡng sinh</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="staffId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nhân viên</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={readOnly}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn nhân viên" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Trần Văn B</SelectItem>
                    <SelectItem value="2">Nguyễn Thị D</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Ngày hẹn</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={readOnly}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: vi })
                        ) : (
                          <span>Chọn ngày</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giờ hẹn</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={readOnly}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giờ" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 13 }, (_, i) => i + 8).map((hour) => (
                      <SelectItem key={hour} value={`${hour}:00`}>
                        {hour}:00
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ghi chú thêm về lịch hẹn..."
                  className="resize-none"
                  {...field}
                  disabled={readOnly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          {readOnly ? (
            <>
              <Button type="button" variant="outline" onClick={onCancel}>
                Đóng
              </Button>
              <Button type="button" onClick={onEdit}>
                Chỉnh sửa
              </Button>
            </>
          ) : (
            <>
              <Button type="button" variant="outline" onClick={onCancel}>
                Hủy bỏ
              </Button>
              <Button type="submit">Lưu lịch hẹn</Button>
            </>
          )}
        </div>
      </form>
    </Form>
  )
}
