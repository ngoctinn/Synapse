"use client"

import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { AnimatePresence, motion } from "framer-motion"
import {
    ArrowLeft,
    CalendarIcon,
    CheckCircle2,
    ChevronRight,
    Clock,
    Info,
    Sparkles,
    Star,
    User
} from "lucide-react"
import * as React from "react"

import { cn } from "@/shared/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Calendar } from "@/shared/ui/calendar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/shared/ui/dialog"
import { Label } from "@/shared/ui/label"
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group"
import { ScrollArea } from "@/shared/ui/scroll-area"
import { Separator } from "@/shared/ui/separator"

// --- Mock Data Types ---
interface Service {
  id: string
  name: string
  duration: number // minutes
  price: number
}

interface Staff {
  id: string
  name: string
  role: string
  rating: number
  avatar: string
  tags: string[]
}

interface TimeSlot {
  time: string
  isRecommended?: boolean // High utilization / optimization hint
  isHighDemand?: boolean
}

// --- Mock Data ---
const MOCK_STAFF: Staff[] = [
  {
    id: "s1",
    name: "Nguyễn Thị Lan",
    role: "Senior Therapist",
    rating: 4.9,
    avatar: "https://i.pravatar.cc/150?u=s1",
    tags: ["Kinh nghiệm 5 năm", "Massage trị liệu"]
  },
  {
    id: "s2",
    name: "Trần Văn Hùng",
    role: "Master Stylist",
    rating: 4.8,
    avatar: "https://i.pravatar.cc/150?u=s2",
    tags: ["Kỹ thuật cao", "Cắt tóc nam"]
  },
  {
    id: "s3",
    name: "Lê Thị Mai",
    role: "Therapist",
    rating: 4.7,
    avatar: "https://i.pravatar.cc/150?u=s3",
    tags: ["Chăm sóc da", "Nhẹ nhàng"]
  }
]

const MOCK_SLOTS: TimeSlot[] = [
  { time: "09:00" },
  { time: "09:30", isHighDemand: true },
  { time: "10:00", isRecommended: true },
  { time: "10:30" },
  { time: "11:00", isRecommended: true },
  { time: "13:30" },
  { time: "14:00", isRecommended: true },
  { time: "14:30", isHighDemand: true },
  { time: "15:00" },
  { time: "16:00", isRecommended: true },
]

// --- Component Props ---
interface BookingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  service?: Service
  defaultStaffId?: string // If re-booking with previous staff
}

type Step = "preference" | "staff-select" | "time-select" | "confirm" | "success"

export function BookingDialog({
  open,
  onOpenChange,
  service = { id: "srv1", name: "Trị liệu da chuyên sâu", duration: 60, price: 500000 }, // Mock default
  defaultStaffId
}: BookingDialogProps) {
  const [step, setStep] = React.useState<Step>("preference")
  const [preference, setPreference] = React.useState<"any" | "specific">("any")
  const [selectedStaff, setSelectedStaff] = React.useState<Staff | null>(null)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null)

  // Reset state when opening
  React.useEffect(() => {
    if (open) {
      setStep("preference")
      setPreference(defaultStaffId ? "specific" : "any")
      setSelectedStaff(defaultStaffId ? MOCK_STAFF.find(s => s.id === defaultStaffId) || null : null)
      setSelectedDate(new Date())
      setSelectedTime(null)
    }
  }, [open, defaultStaffId])

  const handleNext = () => {
    if (step === "preference") {
      if (preference === "specific") {
        setStep("staff-select")
      } else {
        setStep("time-select")
      }
    } else if (step === "staff-select") {
      setStep("time-select")
    } else if (step === "time-select") {
      setStep("confirm")
    } else if (step === "confirm") {
      // Simulate API call
      setTimeout(() => setStep("success"), 1000)
    }
  }

  const handleBack = () => {
    if (step === "staff-select") setStep("preference")
    else if (step === "time-select") {
      setStep(preference === "specific" ? "staff-select" : "preference")
    } else if (step === "confirm") setStep("time-select")
  }

  const steps = {
    preference: (
      <div className="space-y-6 py-4">
        <div className="space-y-2 text-center">
          <h3 className="text-lg font-medium text-foreground">
            Lựa chọn chuyên gia của bạn
          </h3>
          <p className="text-sm text-muted-foreground">
            Bạn có muốn chỉ định chuyên gia thực hiện dịch vụ này không?
          </p>
        </div>

        <RadioGroup
          value={preference}
          onValueChange={(v) => setPreference(v as "any" | "specific")}
          className="grid gap-4"
        >
          {/* Option: Bất kỳ ai (Recommened) */}
          <div>
            <RadioGroupItem
              value="any"
              id="pref-any"
              className="peer sr-only"
            />
            <Label
              htmlFor="pref-any"
              className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
            >
              <div className="mb-3 rounded-full bg-primary/10 p-2 text-primary">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="text-center space-y-1">
                <span className="font-semibold block text-base">Linh hoạt (Được đề xuất)</span>
                <span className="text-sm text-muted-foreground font-normal leading-snug block max-w-[200px] mx-auto">
                  Dễ dàng chọn được khung giờ đẹp ưng ý mà không phải chờ đợi lâu.
                </span>
              </div>
            </Label>
          </div>

          {/* Option: Chỉ định (Manual) */}
          <div>
            <RadioGroupItem
              value="specific"
              id="pref-specific"
              className="peer sr-only"
            />
            <Label
              htmlFor="pref-specific"
              className="flex items-center gap-4 rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
            >
              <div className="rounded-full bg-muted p-2">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <span className="font-semibold block">Chọn chuyên gia cụ thể</span>
                <span className="text-sm text-muted-foreground font-normal">
                  Chỉ định người bạn yêu thích
                </span>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>
    ),

    "staff-select": (
      <div className="space-y-4 py-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">Chọn chuyên gia</h3>
        </div>
        <ScrollArea className="h-[40vh] min-h-[300px] pr-4">
          <div className="space-y-3">
            {MOCK_STAFF.map((staff) => (
              <div
                key={staff.id}
                onClick={() => setSelectedStaff(staff)}
                className={cn(
                  "flex items-start gap-4 p-3 rounded-lg border transition-all cursor-pointer hover:shadow-sm",
                  selectedStaff?.id === staff.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                <Avatar className="h-12 w-12 border">
                  <AvatarImage src={staff.avatar} />
                  <AvatarFallback>{staff.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{staff.name}</span>
                    <Badge variant="secondary" className="flex items-center gap-1 text-[10px] h-5">
                      <Star className="h-3 w-3 fill-primary text-primary" />
                      {staff.rating}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">{staff.role}</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {staff.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-muted rounded text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    ),

    "time-select": (
      <div className="space-y-6 pt-2">
        {/* Date Picker */}
        <div className="rounded-lg border bg-card p-3 shadow-sm">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="w-full flex justify-center"
            fromDate={new Date()}
            classNames={{
              head_cell: "text-muted-foreground font-normal text-[0.8rem] w-9",
              cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: cn(
                "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md transition-all"
              ),
              day_selected:
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
            }}
          />
        </div>

        {/* Slots */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Giờ trống {selectedDate ? `- ${format(selectedDate, "dd/MM", { locale: vi })}` : ""}</span>
            {preference === 'any' && (
              <Badge variant="outline" className="text-[10px] border-[var(--status-serving-border)] text-[var(--status-serving-foreground)] bg-[var(--status-serving)]/10">
                <Sparkles className="h-3 w-3 mr-1" />
                Giờ vàng
              </Badge>
            )}
          </div>

          <ScrollArea className="h-[120px]">
            <div className="grid grid-cols-4 gap-2">
              {MOCK_SLOTS.map((slot) => (
                <Button
                  key={slot.time}
                  variant={selectedTime === slot.time ? "default" : "outline"}
                  className={cn(
                    "h-10 text-sm relative",
                    selectedTime === slot.time ? "ring-2 ring-primary ring-offset-1" : "",
                    slot.isRecommended && selectedTime !== slot.time ? "border-[var(--status-serving-border)] bg-[var(--status-serving)] text-[var(--status-serving-foreground)] hover:bg-[var(--status-serving)]/90" : ""
                  )}
                  onClick={() => setSelectedTime(slot.time)}
                >
                  {slot.time}
                  {slot.isRecommended && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--status-serving-foreground)] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--status-serving-foreground)]"></span>
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    ),

    confirm: (
      <div className="space-y-6 py-4">
        <div className="rounded-xl bg-muted/50 p-6 space-y-6">
          {/* Service Info */}
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-base">{service.name}</h4>
              <p className="text-sm text-muted-foreground">{service.duration} phút • {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}</p>
            </div>
          </div>

          <Separator />

          {/* Booking Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" /> Ngày
              </span>
              <span className="font-medium">
                {selectedDate ? format(selectedDate, "EEEE, dd/MM/yyyy", { locale: vi }) : "Chưa chọn"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" /> Giờ
              </span>
              <span className="font-medium">{selectedTime || "Chưa chọn"}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" /> Chuyên gia
              </span>
              <div className="flex items-center gap-2">
                {preference === 'any' ? (
                  <Badge variant="secondary" className="font-normal bg-primary/10 text-primary hover:bg-primary/20">
                    Mặc định (Tối ưu)
                  </Badge>
                ) : (
                  <span className="font-medium">{selectedStaff?.name}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Policy Alert with Reactive Scheduling hint */}
        <Alert className="bg-orange-50 border-orange-200 text-orange-800">
          <Info className="h-4 w-4 !text-orange-600" />
          <AlertTitle className="text-orange-800 font-medium">Lưu ý quan trọng</AlertTitle>
          <AlertDescription className="text-orange-700 text-xs mt-1">
            Vui lòng đến sớm 10 phút. Nếu đến muộn quá 15 phút, hệ thống sẽ tự động dời lịch để đảm bảo trải nghiệm tốt nhất.
          </AlertDescription>
        </Alert>
      </div>
    ),

    success: (
      <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center animate-in fade-in zoom-in duration-300">
        <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2 ring-8 ring-green-50">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-green-700">Đặt lịch thành công!</h3>
          <p className="text-muted-foreground max-w-[250px] mx-auto text-sm">
            Cảm ơn bạn đã đặt lịch. Chúng tôi đã gửi xác nhận qua email.
          </p>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 gap-0 overflow-hidden">
        <div className="p-6 pb-2">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {step === "success" ? "" : "Đặt lịch hẹn"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {step === "preference" && "Bước 1/3: Tùy chọn"}
              {step === "staff-select" && "Bước 2/3: Chọn chuyên gia"}
              {step === "time-select" && "Bước 2/3: Chọn thời gian"}
              {step === "confirm" && "Bước 3/3: Xác nhận"}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 pb-4 min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {steps[step]}
            </motion.div>
          </AnimatePresence>
        </div>

        {step !== "success" && (
          <div className="p-6 pt-2 bg-muted/20 border-t flex items-center justify-between">
            {step !== "preference" && (
              <Button
                variant="ghost"
                onClick={handleBack}
                className="text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
            )}

            <div className="flex-1" />

            <Button
                onClick={handleNext}
                className={cn("min-w-[120px] shadow-sm", step === "preference" && "w-full")}
                disabled={
                  (step === "staff-select" && !selectedStaff) ||
                  (step === "time-select" && !selectedTime)
                }
              >
                {step === "confirm" ? "Xác nhận đặt" : "Tiếp tục"}
                {step !== "confirm" && <ChevronRight className="h-4 w-4 ml-2" />}
              </Button>

          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
