"use client";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarPlus, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import {
  BookingFormValues,
  bookingSchema,
  BookingService,
  BookingTechnician,
  TimeSlot,
} from "../schemas/booking-schema";
import { BookingSummaryStep } from "./booking/booking-summary-step";
import { DateTimeSelectionStep } from "./booking/datetime-selection-step";
import { ServiceSelectionStep } from "./booking/service-selection-step";

// ===== MOCK DATA =====
const MOCK_SERVICES: BookingService[] = [
  {
    id: "srv-1",
    name: "Chăm sóc da mặt chuyên sâu",
    duration: 90,
    price: 850000,
    image_url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400",
    description: "Làm sạch, tẩy tế bào chết, massage và đắp mặt nạ cao cấp.",
  },
  {
    id: "srv-2",
    name: "Massage Body Thụy Điển",
    duration: 60,
    price: 650000,
    image_url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400",
    description: "Massage thư giãn toàn thân, giảm căng thẳng hiệu quả.",
  },
  {
    id: "srv-3",
    name: "Triệt lông vĩnh viễn",
    duration: 45,
    price: 500000,
    image_url: "https://images.unsplash.com/photo-1598524374912-6b0b0bfe28e9?w=400",
    description: "Công nghệ Diode Laser an toàn, hiệu quả lâu dài.",
  },
  {
    id: "srv-4",
    name: "Gội đầu dưỡng sinh",
    duration: 45,
    price: 250000,
    image_url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400",
    description: "Massage đầu thư giãn kết hợp tinh dầu hữu cơ.",
  },
];

const MOCK_TECHNICIANS: BookingTechnician[] = [
  { id: "ktv-1", name: "Phạm Văn KTV 1", avatar_url: "https://api.dicebear.com/9.x/avataaars/svg?seed=ktv1", title: "Senior" },
  { id: "ktv-2", name: "Hoàng Thị KTV 2", avatar_url: "https://api.dicebear.com/9.x/avataaars/svg?seed=ktv2", title: "Expert" },
  { id: "ktv-3", name: "Vũ Văn KTV 3", avatar_url: "https://api.dicebear.com/9.x/avataaars/svg?seed=ktv3", title: "Junior" },
];

const MOCK_TIME_SLOTS: TimeSlot[] = [
  { time: "09:00", available: true },
  { time: "09:30", available: true },
  { time: "10:00", available: false },
  { time: "10:30", available: true },
  { time: "11:00", available: true },
  { time: "11:30", available: false },
  { time: "14:00", available: true },
  { time: "14:30", available: true },
  { time: "15:00", available: true },
  { time: "15:30", available: false },
  { time: "16:00", available: true },
  { time: "16:30", available: true },
];

// ===== STEP CONFIG =====
const STEPS = [
  { id: 1, title: "Chọn dịch vụ", description: "Chọn dịch vụ bạn muốn đặt" },
  { id: 2, title: "Chọn ngày giờ", description: "Chọn thời gian phù hợp" },
  { id: 3, title: "Xác nhận", description: "Kiểm tra và xác nhận" },
];

interface BookingDialogProps {
  trigger?: React.ReactNode;
}

export function BookingDialog({ trigger }: BookingDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    mode: "onChange",
    defaultValues: {
      service_id: "",
      date: undefined,
      time_slot: "",
      technician_id: "",
      notes: "",
    },
  });

  const selectedServiceId = form.watch("service_id");
  const selectedDate = form.watch("date");
  const selectedTimeSlot = form.watch("time_slot");
  const selectedTechnicianId = form.watch("technician_id");

  const selectedService = MOCK_SERVICES.find((s) => s.id === selectedServiceId);
  const selectedTechnician = MOCK_TECHNICIANS.find((t) => t.id === selectedTechnicianId);

  // Validation per step
  const canProceedStep1 = !!selectedServiceId;
  const canProceedStep2 = !!selectedDate && !!selectedTimeSlot;

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Booking submitted:", data);
    setIsSubmitting(false);
    setOpen(false);
    // Reset form
    form.reset();
    setCurrentStep(1);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Reset on close
      form.reset();
      setCurrentStep(1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2 shadow-md shadow-primary/20">
            <CalendarPlus className="h-4 w-4" />
            Đặt lịch
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-muted/30">
          <DialogTitle className="font-serif text-xl">Đặt lịch hẹn</DialogTitle>
          <DialogDescription>
            {STEPS[currentStep - 1].description}
          </DialogDescription>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 pt-4">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-300",
                    currentStep === step.id
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/30 scale-110"
                      : currentStep > step.id
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {step.id}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "w-12 h-0.5 rounded-full transition-colors duration-300",
                      currentStep > step.id ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </DialogHeader>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 1 && (
                <ServiceSelectionStep
                  services={MOCK_SERVICES}
                  selectedServiceId={selectedServiceId}
                  onSelect={(id) => form.setValue("service_id", id)}
                />
              )}

              {currentStep === 2 && (
                <DateTimeSelectionStep
                  selectedDate={selectedDate}
                  selectedTimeSlot={selectedTimeSlot}
                  selectedTechnicianId={selectedTechnicianId}
                  timeSlots={MOCK_TIME_SLOTS}
                  technicians={MOCK_TECHNICIANS}
                  onDateChange={(date: Date) => form.setValue("date", date)}
                  onTimeSlotChange={(time: string) => form.setValue("time_slot", time)}
                  onTechnicianChange={(id: string) => form.setValue("technician_id", id)}
                />
              )}

              {currentStep === 3 && (
                <BookingSummaryStep
                  service={selectedService}
                  date={selectedDate}
                  timeSlot={selectedTimeSlot}
                  technician={selectedTechnician}
                  notes={form.watch("notes")}
                  onNotesChange={(notes) => form.setValue("notes", notes)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/20">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Quay lại
          </Button>

          {currentStep < 3 ? (
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !canProceedStep1) ||
                (currentStep === 2 && !canProceedStep2)
              }
              className="gap-1 shadow-md shadow-primary/20"
            >
              Tiếp tục
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={form.handleSubmit(handleSubmit)}
              disabled={isSubmitting}
              className="gap-2 min-w-[140px] shadow-md shadow-primary/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Xác nhận đặt lịch"
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
