"use client";

import { Resource, RoomType } from "@/features/resources";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { DurationPicker } from "@/shared/ui/custom/duration-picker";
import { InputWithIcon } from "@/shared/ui/custom/input-with-icon";
import { MoneyInput } from "@/shared/ui/custom/money-input";
import { TagInput } from "@/shared/ui/custom/tag-input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowLeft,
    Box,
    Check,
    ChevronRight,
    Clock,
    FileText,
    Loader2,
    Palette,
    Plus,
    Settings,
    Tag,
    Users,
} from "lucide-react";
import * as React from "react";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createService } from "../actions";
import { ServiceFormValues, serviceSchema } from "../schemas";
import { Skill } from "../types";
import { EquipmentTimelineEditor } from "./equipment-timeline-editor";
import { ImageUpload } from "./image-upload";
import { ServiceTimeVisualizer } from "./service-time-visualizer";

const PRESET_COLORS = [
  "#3b82f6", "#ef4444", "#10b981", "#f59e0b",
  "#8b5cf6", "#ec4899", "#06b6d4", "#f97316"
];

type Step = "basic" | "time" | "resources";

interface CreateServiceWizardProps {
  availableSkills: Skill[];
  availableRoomTypes: RoomType[];
  availableEquipment: Resource[];
}

const STEP_CONFIG: Record<Step, { title: string; description: string; icon: React.ElementType }> = {
  basic: {
    title: "Thông tin cơ bản",
    description: "Nhập thông tin hiển thị của dịch vụ",
    icon: FileText,
  },
  time: {
    title: "Thời gian & Giá",
    description: "Cấu hình thời lượng và chi phí",
    icon: Clock,
  },
  resources: {
    title: "Tài nguyên",
    description: "Yêu cầu phòng, thiết bị và kỹ năng",
    icon: Settings,
  },
};

export function CreateServiceWizard({
  availableSkills,
  availableRoomTypes,
  availableEquipment,
}: CreateServiceWizardProps) {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState<Step>("basic");
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema) as Resolver<ServiceFormValues>,
    mode: "onChange",
    defaultValues: {
      name: "",
      duration: 60,
      buffer_time: 15,
      price: 0,
      is_active: true,
      image_url: "",
      color: "#3b82f6",
      description: "",
      resource_requirements: {
        room_type_id: undefined,
        equipment_ids: [],
        equipment_usage: [],
      },
      skill_ids: [],
      new_skills: [],
    },
  });

  const duration = form.watch("duration");
  const bufferTime = form.watch("buffer_time");

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      form.reset();
      setStep("basic");
    }
  }, [open, form]);

  // Convert skills/equipment for TagInput
  const skillOptions = availableSkills.map(s => ({ id: s.id, label: s.name }));

  const handleNext = async () => {
    if (step === "basic") {
      const valid = await form.trigger(["name", "color"]);
      if (valid) setStep("time");
    } else if (step === "time") {
      const valid = await form.trigger(["duration", "buffer_time", "price"]);
      if (valid) setStep("resources");
    } else if (step === "resources") {
      form.handleSubmit(onSubmit)();
    }
  };

  const handleBack = () => {
    if (step === "time") setStep("basic");
    else if (step === "resources") setStep("time");
  };

  const onSubmit = (data: ServiceFormValues) => {
    startTransition(async () => {
      try {
        const result = await createService(data);
        if (result.success) {
          toast.success("Tạo dịch vụ thành công!", {
            description: `Dịch vụ "${data.name}" đã được thêm vào hệ thống.`,
          });
          setOpen(false);
        } else {
          toast.error(result.message || "Có lỗi xảy ra");
        }
      } catch {
        toast.error("Đã có lỗi xảy ra");
      }
    });
  };

  const getStepNumber = (s: Step) => {
    const steps: Step[] = ["basic", "time", "resources"];
    return steps.indexOf(s) + 1;
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 py-3">
      {(["basic", "time", "resources"] as Step[]).map((s, i) => {
        const isActive = s === step;
        const isPast = getStepNumber(s) < getStepNumber(step);
        const Icon = STEP_CONFIG[s].icon;

        return (
          <React.Fragment key={s}>
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                isActive && "border-primary bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/30",
                isPast && "border-primary bg-primary/10 text-primary",
                !isActive && !isPast && "border-muted-foreground/30 text-muted-foreground"
              )}
            >
              {isPast ? (
                <Check className="w-4 h-4" />
              ) : (
                <Icon className="w-4 h-4" />
              )}
            </div>
            {i < 2 && (
              <div
                className={cn(
                  "w-8 h-0.5 rounded-full transition-colors duration-300",
                  isPast ? "bg-primary" : "bg-muted-foreground/20"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  const steps = {
    basic: (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="grid md:grid-cols-[180px_1fr] gap-6">
          {/* Image Upload */}
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/80">Ảnh đại diện</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    className="aspect-square"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Basic Info */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80">
                    Tên dịch vụ <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <InputWithIcon
                      Icon={Tag}
                      placeholder="VD: Massage Body Thụy Điển"
                      className="h-11 rounded-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Color Picker */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80">Màu hiển thị (trên lịch)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2 bg-background p-2 rounded-lg border h-11">
                      <div className="relative group">
                        <input
                          type="color"
                          className="w-7 h-7 p-0 border-0 rounded-full overflow-hidden cursor-pointer opacity-0 absolute inset-0 z-10"
                          {...field}
                        />
                        <div
                          className="w-7 h-7 rounded-full border shadow-sm ring-1 ring-border/20"
                          style={{ backgroundColor: field.value }}
                        />
                      </div>
                      <div className="flex gap-1.5 overflow-x-auto py-1 px-1">
                        {PRESET_COLORS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            aria-label={`Chọn màu ${color}`}
                            className={cn(
                              "w-6 h-6 rounded-full border transition-all flex-shrink-0 cursor-pointer",
                              "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none",
                              field.value === color
                                ? "ring-2 ring-primary ring-offset-1 scale-110"
                                : "hover:scale-110 hover:shadow-sm"
                            )}
                            style={{ backgroundColor: color }}
                            onClick={() => field.onChange(color)}
                          />
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground/80">Mô tả dịch vụ</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Mô tả chi tiết về quy trình, lợi ích (Hiển thị trên app khách hàng)..."
                  className="min-h-[100px] resize-none rounded-lg"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    ),

    time: (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/80 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Thời lượng
                </FormLabel>
                <FormControl>
                  <DurationPicker
                    value={field.value}
                    onChange={field.onChange}
                    min={15}
                    step={15}
                    className="h-11 rounded-lg bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="buffer_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/80 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  Nghỉ giữa ca
                </FormLabel>
                <FormControl>
                  <DurationPicker
                    value={field.value}
                    onChange={field.onChange}
                    min={0}
                    step={15}
                    className="h-11 rounded-lg bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Timeline Visualizer */}
        <ServiceTimeVisualizer
          duration={duration}
          bufferTime={bufferTime}
          className="bg-muted/20 border-2 border-dashed border-primary/20 rounded-xl p-4"
        />

        {/* Price */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground/80 flex items-center gap-2">
                <Palette className="w-4 h-4 text-primary" />
                Giá niêm yết
              </FormLabel>
              <FormControl>
                <MoneyInput
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
    ),

    resources: (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        {/* Room Type */}
        <FormField
          control={form.control}
          name="resource_requirements.room_type_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground/80 flex items-center gap-2">
                <Box className="w-4 h-4 text-primary" />
                Loại phòng yêu cầu
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-11 rounded-lg bg-background">
                    <SelectValue placeholder="-- Chọn loại phòng --" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableRoomTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Skills */}
        <FormField
          control={form.control}
          name="skill_ids"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground/80 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Kỹ năng nhân viên
              </FormLabel>
              <FormControl>
                <TagInput
                  options={skillOptions}
                  selectedIds={field.value}
                  newTags={form.watch("new_skills")}
                  onSelectedChange={field.onChange}
                  onNewTagsChange={(tags) => form.setValue("new_skills", tags)}
                  placeholder="Chọn kỹ năng..."
                  className="min-h-[44px] rounded-lg bg-background"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Equipment Timeline */}
        <div className="space-y-3 pt-2 border-t">
          <FormLabel className="text-foreground/80 flex items-center gap-2">
            <Settings className="w-4 h-4 text-primary" />
            Thiết bị & Timeline
          </FormLabel>
          <FormField
            control={form.control}
            name="resource_requirements.equipment_usage"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <EquipmentTimelineEditor
                    serviceDuration={duration}
                    availableEquipment={availableEquipment.filter(e => e.type === "EQUIPMENT")}
                    value={field.value || []}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    ),
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="text-xs">
          <Plus className="mr-2 h-3.5 w-3.5" /> Thêm dịch vụ
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
        {/* Header */}
        <div className="p-6 pb-2 border-b bg-muted/10">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Tạo dịch vụ mới
            </DialogTitle>
            <DialogDescription className="text-sm">
              {STEP_CONFIG[step].description}
            </DialogDescription>
          </DialogHeader>

          {/* Step Indicator */}
          {renderStepIndicator()}
        </div>

        {/* Content */}
        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()} className="flex-1 overflow-y-auto">
            <div className="p-6 min-h-[350px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {steps[step]}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer Actions */}
            <div className="p-6 pt-4 border-t bg-muted/10 flex items-center justify-between">
              {step !== "basic" ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBack}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  Bước {getStepNumber(step)}/3
                </span>
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isPending}
                  className="min-w-[140px] shadow-md shadow-primary/20"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang tạo...
                    </>
                  ) : step === "resources" ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Tạo dịch vụ
                    </>
                  ) : (
                    <>
                      Tiếp tục
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
