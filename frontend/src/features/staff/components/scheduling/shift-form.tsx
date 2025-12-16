"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Tag } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import {
    Button,
    DialogFooter,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    RequiredMark,
    TimeInput,
} from "@/shared/ui"
import { ColorSwatchGroup } from "@/shared/ui/custom/color-swatch-group"
import { Shift } from "../../model/types"

const formSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên ca"),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Giờ không hợp lệ"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Giờ không hợp lệ"),
  color: z.string(),
}).refine(
  (data) => {
    const [startH, startM] = data.startTime.split(':').map(Number);
    const [endH, endM] = data.endTime.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    return endMinutes > startMinutes;
  },
  {
    message: "Giờ kết thúc phải sau giờ bắt đầu",
    path: ["endTime"],
  }
)

interface ShiftFormProps {
  onSuccess: (shift: Shift) => void
  onCancel: () => void
}

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#6366f1"];

export function ShiftForm({ onSuccess, onCancel }: ShiftFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      startTime: "08:00",
      endTime: "17:00",
      color: "#3b82f6",
    },
  })

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const newShift: Shift = {
      id: window.crypto.randomUUID(),
      name: values.name,
      startTime: values.startTime,
      endTime: values.endTime,
      color: values.color,
      type: "WORK",
    }
    onSuccess(newShift)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Tên ca <RequiredMark />
              </FormLabel>
              <FormControl>
                <Input
                  startContent={<Tag className="size-4" />}
                  placeholder="Ví dụ: Ca gãy, Tăng ca..."
                  className="h-11 rounded-lg"
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
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Bắt đầu <RequiredMark />
                </FormLabel>
                <FormControl>
                   <TimeInput
                    value={field.value}
                    onChange={field.onChange}
                    className="h-11 rounded-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Kết thúc <RequiredMark />
                </FormLabel>
                <FormControl>
                  <TimeInput
                    value={field.value}
                    onChange={field.onChange}
                    className="h-11 rounded-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Màu sắc</FormLabel>
              <FormControl>
                <ColorSwatchGroup
                  value={field.value}
                  onChange={field.onChange}
                  options={COLORS}
                  ariaLabel="Chọn màu sắc cho ca làm việc"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="lg" onClick={onCancel}>
                Hủy
            </Button>
            <Button type="submit" size="lg">
                Thêm ca
            </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
