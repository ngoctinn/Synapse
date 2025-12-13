"use client"

import { ArrowLeft, ChevronRight } from "lucide-react"
import * as React from "react"

import { Service } from "@/features/services/types"
import { MOCK_STAFF } from "@/features/staff"
import { useReducedMotion } from "@/shared/hooks"
import { Button } from "@/shared/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog"
import { Progress } from "@/shared/ui/progress"

import { BookingSidebar } from "./booking/booking-sidebar"
import { StepConfirm } from "./booking/steps/step-confirm"
import { StepPreference } from "./booking/steps/step-preference"
import { StepStaff } from "./booking/steps/step-staff"
import { StepSuccess } from "./booking/steps/step-success"
import { StepTime } from "./booking/steps/step-time"
import { BookingState } from "./booking/types"

interface BookingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  service?: Service
  defaultStaffId?: string
}

const DEFAULT_SERVICE: Service = {
  id: "srv_default",
  name: "Trị liệu da chuyên sâu",
  duration: 60,
  buffer_time: 15,
  price: 500000,
  color: "#3b82f6",
  is_active: true,
  skills: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export function BookingDialog({ open, onOpenChange, service = DEFAULT_SERVICE, defaultStaffId }: BookingDialogProps) {
  const [state, setState] = React.useState<BookingState>({
    step: "preference",
    preference: "any",
    selectedStaff: null,
    selectedDate: new Date(),
    selectedTime: null,
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const prefersReducedMotion = useReducedMotion()

  React.useEffect(() => {
    if (open) {
      setState({
        step: "preference",
        preference: defaultStaffId ? "specific" : "any",
        selectedStaff: defaultStaffId ? MOCK_STAFF.find((s) => s.user_id === defaultStaffId) || null : null,
        selectedDate: new Date(),
        selectedTime: null,
      })
      setIsSubmitting(false)
    }
  }, [open, defaultStaffId])

  const updateState = (updates: Partial<BookingState>) => setState(prev => ({ ...prev, ...updates }))

  const handleNext = () => {
    const { step, preference } = state
    if (step === "preference") updateState({ step: preference === "specific" ? "staff-select" : "time-select" })
    else if (step === "staff-select") updateState({ step: "time-select" })
    else if (step === "time-select") updateState({ step: "confirm" })
    else if (step === "confirm") {
      setIsSubmitting(true)
      setTimeout(() => { updateState({ step: "success" }); setIsSubmitting(false) }, 1000)
    }
  }

  const handleBack = () => {
    const { step, preference } = state
    if (step === "staff-select") updateState({ step: "preference" })
    else if (step === "time-select") updateState({ step: preference === "specific" ? "staff-select" : "preference" })
    else if (step === "confirm") updateState({ step: "time-select" })
  }

  const progress = React.useMemo(() => {
    switch (state.step) {
      case "preference": return 33
      case "staff-select": return 50
      case "time-select": return 66
      case "confirm": return 90
      case "success": return 100
      default: return 0
    }
  }, [state.step])

  const renderStep = () => {
    const commonProps = { service, state, updateState, onNext: handleNext, onBack: handleBack, isSubmitting }
    switch (state.step) {
        case "preference": return <StepPreference {...commonProps} />
        case "staff-select": return <StepStaff {...commonProps} />
        case "time-select": return <StepTime {...commonProps} />
        case "confirm": return <StepConfirm {...commonProps} />
        case "success": return <StepSuccess onClose={() => onOpenChange(false)} />
        default: return null
    }
  }

  const stepTitle = {
      preference: "Tùy chọn đặt lịch",
      "staff-select": "Chọn chuyên gia",
      "time-select": "Chọn thời gian",
      confirm: "Xác nhận & Thanh toán",
      success: "Hoàn tất"
  }[state.step]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-lg md:max-w-4xl p-0 gap-0 overflow-hidden h-[85vh] md:h-auto md:max-h-[600px] flex flex-col md:flex-row bg-background border-none shadow-2xl">
        <DialogTitle className="sr-only">{stepTitle}</DialogTitle>
        {state.step !== "success" && (
            <div className="hidden md:block w-[300px] shrink-0 h-full">
                <BookingSidebar service={service} state={state} className="h-full" />
            </div>
        )}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
            {state.step !== "success" && (
                <div className="px-6 pt-6 pb-2 shrink-0 space-y-4">
                    <div className="flex items-center justify-between">
                         <div className="space-y-1">
                             <h2 className="text-lg font-semibold tracking-tight">{stepTitle}</h2>
                             <div className="text-xs text-muted-foreground flex items-center gap-2">
                                 <span>Bước {state.step === "confirm" ? 3 : state.step === "preference" ? 1 : 2} / 3</span>
                                 <span className="text-muted-foreground/30">•</span>
                                 <span>{service.name}</span>
                             </div>
                         </div>
                         <div className="md:hidden font-medium text-primary bg-primary/10 px-3 py-1 rounded-full text-sm">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}
                         </div>
                    </div>
                   <Progress value={progress} className="h-1 bg-muted" />
                </div>
            )}
            <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="h-full">{renderStep()}</div>
            </div>
             {state.step !== "success" && (
                <div className="p-6 border-t bg-muted/5 mt-auto flex items-center justify-between shrink-0">
                     {state.step !== "preference" ? (
                        <Button variant="ghost" onClick={handleBack} disabled={isSubmitting} className="text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent" startContent={<ArrowLeft className="size-4" />}>
                            Quay lại
                        </Button>
                     ) : <div />}
                    <Button onClick={handleNext} className="shadow-lg min-w-[140px] h-12 text-base" isLoading={isSubmitting} disabled={isSubmitting || (state.step === "staff-select" && !state.selectedStaff) || (state.step === "time-select" && !state.selectedTime)} endContent={!(isSubmitting || state.step === "confirm") ? <ChevronRight className="size-4" /> : undefined}>
                        {isSubmitting ? "Đang xử lý..." : state.step === "confirm" ? "Xác nhận đặt" : "Tiếp tục"}
                    </Button>
                </div>
             )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
