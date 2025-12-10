"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Checkbox } from "@/shared/ui/checkbox"

import { showToast } from "@/shared/ui/custom/sonner"

import { BirthdayPicker } from "@/shared/ui/custom/birthday-picker"
import { DatePicker } from "@/shared/ui/custom/date-picker"
import { DateRangeFilter } from "@/shared/ui/custom/date-range-filter"
import { DurationPicker } from "@/shared/ui/custom/duration-picker"
import { MaskedDateInput } from "@/shared/ui/custom/masked-date-input"
import { TimeInput } from "@/shared/ui/custom/time-input"
import { TimePicker } from "@/shared/ui/custom/time-picker"
import { TimeRangeInput } from "@/shared/ui/custom/time-range-input"
import { YearPicker } from "@/shared/ui/custom/year-picker"

import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Separator } from "@/shared/ui/separator"
import { Switch } from "@/shared/ui/switch"
import { Mail, User } from "lucide-react"
import { useState } from "react"
import { DateRange } from "react-day-picker"

export default function ComponentsPage() {
  return (
    <div className="space-y-8 pb-10">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Components Gallery</h2>
        <p className="text-muted-foreground">
          Trang kiểm thử các component giao diện được sử dụng trong hệ thống.
        </p>
      </div>

      <Separator />

      <div className="grid gap-8 md:grid-cols-2">
        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>Các biến thể của nút bấm.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon"><User className="h-4 w-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button disabled>Disabled</Button>
              <Button>
                <Mail className="mr-2 h-4 w-4" /> Login with Email
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Inputs */}
        <Card>
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
            <CardDescription>Các trường nhập liệu cơ bản.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" placeholder="Email" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input type="password" id="password" placeholder="Password" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="disabled">Disabled</Label>
              <Input disabled id="disabled" placeholder="Disabled input" />
            </div>
          </CardContent>
        </Card>

        {/* Avatars & Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Avatars & Badges</CardTitle>
            <CardDescription>Hình đại diện và nhãn trạng thái.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src="https://github.com/vercel.png" />
                <AvatarFallback>VC</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-wrap gap-4">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Controls</CardTitle>
            <CardDescription>Switch, Checkbox và các điều khiển khác.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-2">
              <Switch id="airplane-mode" />
              <Label htmlFor="airplane-mode">Airplane Mode</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">Accept terms and conditions</Label>
            </div>
          </CardContent>
        </Card>

        {/* Time & Date Components */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Time & Date Components</CardTitle>
            <CardDescription>Bộ công cụ xử lý thời gian (Date/Time Pickers) đã được tối ưu cho người Việt.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            <div className="space-y-2">
              <Label>Date Picker (Single)</Label>
              <DatePickerDemo />
              <p className="text-[0.8rem] text-muted-foreground">Chọn một ngày cụ thể.</p>
            </div>

            <div className="space-y-2">
              <Label>Date Range Filter</Label>
              <DateRangeFilterDemo />
              <p className="text-[0.8rem] text-muted-foreground">Lọc theo khoảng thời gian (có Preset).</p>
            </div>

            <div className="space-y-2">
              <Label>Masked Date Input</Label>
              <MaskedDateInputDemo />
              <p className="text-[0.8rem] text-muted-foreground">Nhập ngày thủ công (DD/MM/YYYY).</p>
            </div>

            <div className="space-y-2">
              <Label>Time Picker (Dropdown)</Label>
              <TimePickerDemo />
              <p className="text-[0.8rem] text-muted-foreground">Chọn giờ chi tiết (tách cột).</p>
            </div>

             <div className="space-y-2">
              <Label>Time Input (Native)</Label>
              <div className="flex flex-col gap-2">
                 <TimeInput variant="sm" />
                 <TimeInput variant="default" />
              </div>
              <p className="text-[0.8rem] text-muted-foreground">Input giờ native của trình duyệt.</p>
            </div>

             <div className="space-y-2">
              <Label>Time Range Input</Label>
              <TimeRangeInputDemo />
              <p className="text-[0.8rem] text-muted-foreground">Chọn khoảng giờ bắt đầu - kết thúc.</p>
            </div>

            <div className="space-y-2">
              <Label>Duration Picker</Label>
              <DurationPickerDemo />
              <p className="text-[0.8rem] text-muted-foreground">Chọn thời lượng (Phút/Giờ).</p>
            </div>

            <div className="space-y-2">
              <Label>Year Picker</Label>
              <YearPickerDemo />
              <p className="text-[0.8rem] text-muted-foreground">Chọn năm nhanh chóng.</p>
            </div>

             <div className="space-y-2">
              <Label>Birthday Picker</Label>
              <BirthdayPickerDemo />
              <p className="text-[0.8rem] text-muted-foreground">Chọn ngày sinh (giới hạn năm).</p>
            </div>

          </CardContent>
        </Card>

        {/* Sonner Toasts */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Sonner Toasts</CardTitle>
            <CardDescription>Thông báo Toast với giao diện Premium.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button
                variant="outline"
                onClick={() => showToast.success("Thành công", "Thao tác đã được thực hiện thành công.")}
                className="border-emerald-500/20 hover:bg-emerald-500/10 hover:text-emerald-600"
              >
                Success Toast
              </Button>
              <Button
                variant="outline"
                onClick={() => showToast.info("Thông tin", "Đây là một thông báo thông tin.")}
                className="border-blue-500/20 hover:bg-blue-500/10 hover:text-blue-600"
              >
                Info Toast
              </Button>
              <Button
                variant="outline"
                onClick={() => showToast.warning("Cảnh báo", "Vui lòng kiểm tra lại thông tin.")}
                className="border-amber-500/20 hover:bg-amber-500/10 hover:text-amber-600"
              >
                Warning Toast
              </Button>
              <Button
                variant="outline"
                onClick={() => showToast.error("Lỗi", "Đã có lỗi xảy ra, vui lòng thử lại.")}
                className="border-red-500/20 hover:bg-red-500/10 hover:text-red-600"
              >
                Error Toast
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Spacer for scrolling */}
      <div className="h-[200px] flex items-center justify-center text-muted-foreground border-t border-dashed mt-10">
        Khu vực cuộn để test vị trí Popover
      </div>
    </div>
  )
}

// --- Demos ---

function DatePickerDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  return <DatePicker value={date} onChange={setDate} />
}

function DateRangeFilterDemo() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  return <DateRangeFilter dateRange={dateRange} setDateRange={setDateRange} />
}

function MaskedDateInputDemo() {
  const [date, setDate] = useState<Date | undefined>()
  return <MaskedDateInput value={date} onChange={setDate} />
}

function DurationPickerDemo() {
  const [duration, setDuration] = useState<number>(60)
  return <DurationPicker value={duration} onChange={setDuration} />
}

function TimePickerDemo() {
  const [time, setTime] = useState<string>("09:00")
  return <TimePicker value={time} onChange={setTime} />
}

function TimeRangeInputDemo() {
  const [start, setStart] = useState("09:00")
  const [end, setEnd] = useState("17:00")
  return (
    <TimeRangeInput
      startTime={start}
      endTime={end}
      onStartTimeChange={setStart}
      onEndTimeChange={setEnd}
      onRemove={() => {}}
    />
  )
}

function YearPickerDemo() {
    const [date, setDate] = useState<Date | undefined>(new Date())
    return (
        <YearPicker date={date} onSelect={setDate} />
    )
}

function BirthdayPickerDemo() {
    const [date, setDate] = useState<Date | undefined>()
    return (
        <BirthdayPicker date={date} setDate={setDate} />
    )
}


