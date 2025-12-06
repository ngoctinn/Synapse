"use client"

/**
 * BookingDialog - Multi-step đặt lịch hẹn cho khách hàng
 *
 * Theme Tokens Used:
 * - --primary, --primary-foreground: Màu chính cho buttons và highlights
 * - --status-serving: Màu xanh lá cho "Giờ vàng" recommendations
 * - --alert-warning: Màu cảnh báo cho policy notice
 * - --alert-success: Màu thành công cho success state
 * - --muted, --muted-foreground: Màu phụ cho text và borders
 *
 * UX Guidelines Applied:
 * - Clickable step indicators with visual feedback
 * - Motion-safe animations for step transitions
 * - Touch target size ≥44px for interactive elements
 * - Focus-visible states for accessibility
 * - font-serif for headings following Premium Spa theme
 */

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
  Star,
  User,
  Users
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
  DialogHeader,
  DialogTitle
} from "@/shared/ui/dialog"
import { Label } from "@/shared/ui/label"
import { Progress } from "@/shared/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group"
import { ScrollArea } from "@/shared/ui/scroll-area"
import { Separator } from "@/shared/ui/separator"

import { MOCK_SLOTS, MOCK_STAFF } from "../mocks"
import { BookingService, BookingStaff } from "../types"

// --- Component Props ---
interface BookingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  service?: BookingService
  defaultStaffId?: string // If re-booking with previous staff
}

type Step = "preference" | "staff-select" | "time-select" | "confirm" | "success"

const STEP_CONFIG: Record<
  Exclude<Step, "success">,
  { title: string; description: string; icon: React.ElementType; number: number }
> = {
  preference: {
    title: "Tùy chọn",
    description: "Chọn cách tìm chuyên gia",
    icon: Users,
    number: 1,
  },
  "staff-select": {
    title: "Chuyên gia",
    description: "Chọn người thực hiện",
    icon: User,
    number: 2,
  },
  "time-select": {
    title: "Thời gian",
    description: "Chọn ngày và giờ",
    icon: Clock,
    number: 2,
  },
  confirm: {
    title: "Xác nhận",
    description: "Kiểm tra thông tin",
    icon: Check,
    number: 3,
  },
}

export function BookingDialog({
  open,
  onOpenChange,
  service = { id: "srv1", name: "Trị liệu da chuyên sâu", duration: 60, price: 500000 },
  defaultStaffId,
}: BookingDialogProps) {
  const [step, setStep] = React.useState<Step>("preference")
  const [preference, setPreference] = React.useState<"any" | "specific">("any")
  const [selectedStaff, setSelectedStaff] = React.useState<BookingStaff | null>(null)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Calculate progress
  const progress = React.useMemo(() => {
    switch (step) {
      case "preference": return 33
      case "staff-select": return 66
      case "time-select": return 66
      case "confirm": return 100
      default: return 100
    }
  }, [step])

  // Reset state when opening
  React.useEffect(() => {
    if (open) {
      setStep("preference")
      setPreference(defaultStaffId ? "specific" : "any")
      setSelectedStaff(defaultStaffId ? MOCK_STAFF.find((s) => s.id === defaultStaffId) || null : null)
      setSelectedDate(new Date())
      setSelectedTime(null)
      setIsSubmitting(false)
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
      setIsSubmitting(true)
      // Simulate API call
      setTimeout(() => {
        setStep("success")
        setIsSubmitting(false)
      }, 1500)
    }
  }

  const handleBack = () => {
    if (step === "staff-select") setStep("preference")
    else if (step === "time-select") {
      setStep(preference === "specific" ? "staff-select" : "preference")
    } else if (step === "confirm") setStep("time-select")
  }

  // Get current step number for display (1, 2, or 3)
  const getDisplayStepNumber = (s: Step): number => {
    if (s === "preference") return 1
    if (s === "staff-select" || s === "time-select") return 2
    if (s === "confirm") return 3
    return 0
  }

  // Check if a step can be clicked (already completed)
  const canNavigateToStep = (targetStep: Step): boolean => {
    const currentNum = getDisplayStepNumber(step)
    const targetNum = getDisplayStepNumber(targetStep)
    return targetNum < currentNum
  }

  const renderStepIndicator = () => {
    if (step === "success") return null

    const displaySteps = [
      { key: "preference", label: "Tùy chọn", icon: Users },
      { key: preference === "specific" ? "staff-select" : "time-select", label: preference === "specific" ? "Chuyên gia" : "Thời gian", icon: preference === "specific" ? User : Clock },
      { key: "confirm", label: "Xác nhận", icon: Check },
    ]

    const currentDisplayNum = getDisplayStepNumber(step)

    return (
      <div className="flex items-center justify-center gap-2 py-3 px-4">
        {displaySteps.map((s, i) => {
          const stepNum = i + 1
          const isActive = stepNum === currentDisplayNum
          const isPast = stepNum < currentDisplayNum
          const Icon = s.icon

          return (
            <React.Fragment key={s.key}>
              <button
                type="button"
                onClick={() => {
                  if (isPast) {
                    if (i === 0) setStep("preference")
                    else if (i === 1) setStep(preference === "specific" ? "staff-select" : "time-select")
                  }
                }}
                disabled={!isPast}
                aria-label={`Bước ${stepNum}: ${s.label}`}
                className={cn(
                  "flex items-center justify-center w-10 h-10 min-w-[44px] min-h-[44px] rounded-full border-2 transition-all duration-300",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isActive && "border-primary bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/30",
                  isPast && "border-primary bg-primary/10 text-primary cursor-pointer hover:bg-primary/20",
                  !isActive && !isPast && "border-muted-foreground/30 text-muted-foreground cursor-default"
                )}
              >
                {isPast ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </button>
              {i < displaySteps.length - 1 && (
                <div
                  className={cn(
                    "w-8 h-0.5 rounded-full transition-colors duration-300",
                    isPast ? "bg-primary" : "bg-muted-foreground/20"
                  )}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
    )
  }

  const steps = {
    preference: (
      <div className="space-y-6 py-4">
        <div className="space-y-2 text-center">
          <h3 className="text-lg font-serif font-medium text-foreground">
            Lựa chọn chuyên gia của bạn
          </h3>
          <p className="text-sm text-muted-foreground">
            Bạn có muốn chỉ định chuyên gia thực hiện dịch vụ này không?
          </p>
        </div>

        <RadioGroup
          value={preference}
          onValueChange={(v) => setPreference(v as "any" | "specific")}
          className="grid gap-4 md:grid-cols-2"
        >
          {/* Option: Linh hoạt (Recommended) */}
          <div>
            <RadioGroupItem value="any" id="pref-any" className="peer sr-only" />
            <Label
              htmlFor="pref-any"
              className="flex items-center gap-4 rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
            >
              <div className="h-full flex flex-col">
                 <div className="rounded-full bg-primary/10 p-2 text-primary w-fit mb-3">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-semibold block text-base">Linh hoạt</span>
                    <span className="text-sm text-muted-foreground font-normal leading-snug block">
                      Được đề xuất để có giờ đẹp nhất.
                    </span>
                  </div>
              </div>
            </Label>
          </div>

          {/* Option: Chỉ định cụ thể */}
          <div>
            <RadioGroupItem value="specific" id="pref-specific" className="peer sr-only" />
            <Label
              htmlFor="pref-specific"
              className="flex items-center gap-4 rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all h-full"
            >
              <div className="rounded-full bg-muted p-2 w-fit mb-auto">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="h-full flex flex-col justify-between">
                <div>
                   <span className="font-semibold block">Chọn chuyên gia</span>
                   <span className="text-sm text-muted-foreground font-normal block my-1">
                     Chỉ định người phục vụ riêng.
                   </span>
                </div>
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
          <Badge variant="outline" className="text-xs">
            {MOCK_STAFF.length} người
          </Badge>
        </div>
        <ScrollArea className="h-auto max-h-[50vh] min-h-[300px] pr-4 md:max-h-[400px]">
          <div className="space-y-3">
            {MOCK_STAFF.map((staff) => (
              <button
                key={staff.id}
                type="button"
                onClick={() => setSelectedStaff(staff)}
                aria-label={`Chọn ${staff.name}`}
                className={cn(
                  "w-full flex items-start gap-4 p-3 rounded-lg border transition-all cursor-pointer hover:shadow-sm text-left outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  selectedStaff?.id === staff.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border bg-card hover:bg-accent hover:border-muted-foreground/30"
                )}
              >
                <Avatar className="h-14 w-14 border-2 border-background shadow-sm">
                  <AvatarImage src={staff.avatar} alt={staff.name} />
                  <AvatarFallback className="font-serif">{staff.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm truncate">{staff.name}</span>
                    <Badge variant="secondary" className="flex items-center gap-1 text-[10px] h-5 shrink-0">
                      <Star className="h-3 w-3 fill-primary text-primary" />
                      {staff.rating}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">{staff.role}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {staff.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    ),

    "time-select": (
      <div className="space-y-6 pt-2 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
        {/* Date Picker */}
        <div className="rounded-xl border bg-card/50 p-4 shadow-sm">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="w-full flex justify-center"
            fromDate={new Date()}
            classNames={{
              head_cell: "text-muted-foreground font-normal text-[0.8rem] w-9",
              cell: "h-9 w-9 text-center text-sm p-0 relative",
              day: cn(
                "h-9 w-9 md:h-10 md:w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md transition-all"
              ),
              day_selected:
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              day_today: "bg-accent/50 text-accent-foreground font-medium",
            }}
          />
        </div>

        {/* Time Slots */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Giờ trống {selectedDate ? `- ${format(selectedDate, "dd/MM", { locale: vi })}` : ""}</span>
            {preference === 'any' && (
              <Badge variant="outline" className="text-[10px] border-[var(--status-serving-border)] text-[var(--status-serving-foreground)] bg-[var(--status-serving)]/10">
                <Star className="h-3 w-3 mr-1" />
                Giờ vàng
              </Badge>
            )}
          </div>

          <ScrollArea className="h-[120px] md:h-[280px]">
            <div className="grid grid-cols-4 gap-2 md:grid-cols-2 lg:grid-cols-3">
              {MOCK_SLOTS.map((slot) => (
                <Button
                  key={slot.time}
                  type="button"
                  variant={selectedTime === slot.time ? "default" : "outline"}
                  aria-label={`Chọn giờ ${slot.time}`}
                  className={cn(
                    "h-11 text-sm relative min-w-[3.5rem]",
                    selectedTime === slot.time ? "ring-2 ring-primary ring-offset-1" : "",
                    slot.isRecommended && selectedTime !== slot.time ? "border-[var(--status-serving-border)] bg-[var(--status-serving)] text-[var(--status-serving-foreground)] hover:bg-[var(--status-serving)]/90" : ""
                  )}
                  onClick={() => setSelectedTime(slot.time)}
                >
                  {slot.time}
                  {slot.isRecommended && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--status-serving-foreground)] opacity-75 duration-1000"></span>
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
        <div className="rounded-xl bg-muted/30 p-6 space-y-6 border">
          {/* Service Info */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start gap-4">
               <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <CalendarIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-base">{service.name}</h4>
                <p className="text-sm text-muted-foreground">{service.duration} phút • {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}</p>
              </div>
            </div>
            {/* Added details summary to fill space on desktop if needed, or keep simple */}
             <div className="space-y-2 text-sm md:text-right">
                <div className="text-muted-foreground">Thời gian dự kiến</div>
                <div className="font-medium">{selectedDate ? format(selectedDate, "HH:mm, dd/MM/yyyy", { locale: vi }) : "..."}</div>
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
                {preference === "any" ? (
                  <Badge variant="secondary" className="font-normal bg-primary/10 text-primary">
                    Mặc định (Tối ưu)
                  </Badge>
                ) : (
                  <span className="font-medium">{selectedStaff?.name}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Policy Alert - Using theme tokens */}
        <Alert className="bg-[var(--alert-warning)] border-[var(--alert-warning-border)]">
          <Info className="h-4 w-4 text-[var(--alert-warning-foreground)]" />
          <AlertTitle className="text-[var(--alert-warning-foreground)] font-medium">
            Lưu ý quan trọng
          </AlertTitle>
          <AlertDescription className="text-[var(--alert-warning-foreground)]/80 text-xs mt-1">
            Vui lòng đến sớm 10 phút. Nếu đến muộn quá 15 phút, hệ thống sẽ tự động dời lịch để đảm bảo trải
            nghiệm tốt nhất.
          </AlertDescription>
        </Alert>
      </div>
    ),

    success: (
      <div className="flex flex-col items-center justify-center space-y-6 py-10 text-center motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in duration-300">
        <div className="h-20 w-20 bg-[var(--alert-success)] text-[var(--alert-success-foreground)] rounded-full flex items-center justify-center ring-8 ring-[var(--alert-success)]/30">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-serif font-semibold text-[var(--alert-success-foreground)]">
            Đặt lịch thành công!
          </h3>
          <p className="text-muted-foreground max-w-[280px] mx-auto text-sm">
            Cảm ơn bạn đã đặt lịch. Chúng tôi đã gửi xác nhận qua email và SMS.
          </p>
        </div>
        <Button onClick={() => onOpenChange(false)} className="mt-4 min-w-[140px]">
          Hoàn tất
        </Button>
      </div>
    ),
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] md:max-w-2xl p-0 gap-0 overflow-hidden">
        <div className="p-6 pb-2">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {step === "success" ? "" : "Đặt lịch hẹn"}
            </DialogTitle>
            <div className="space-y-1.5 mt-1">
               <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {step === "preference" && "Bước 1/3: Tùy chọn"}
                    {step === "staff-select" && "Bước 2/3: Chọn chuyên gia"}
                    {step === "time-select" && "Bước 2/3: Chọn thời gian"}
                    {step === "confirm" && "Bước 3/3: Xác nhận"}
                  </span>
                  <span>{Math.round(progress)}%</span>
               </div>
               <Progress value={progress} className="h-1" />
            </div>
          </DialogHeader>
        </div>

            {/* Step Indicator */}
            {renderStepIndicator()}
          </div>
        )}

        {/* Content */}
        <div className={cn("flex-1 overflow-y-auto", step !== "success" && "px-6 pb-4")}>
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

        {/* Footer */}
        {step !== "success" && (
          <div className="p-6 pt-4 border-t bg-muted/10 flex items-center justify-between">
            {step !== "preference" ? (
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Quay lại bước trước"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
            ) : (
              <div />
            )}

            <Button
                onClick={handleNext}
                className={cn("min-w-[120px] shadow-sm", step === "preference" && "w-full")}
                aria-label={step === "confirm" ? "Confirm booking" : "Go to next step"}
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
