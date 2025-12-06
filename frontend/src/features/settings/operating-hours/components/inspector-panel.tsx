
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { TimeInput } from "@/shared/ui/custom/time-input";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { Sheet, SheetContent, SheetFooter } from "@/shared/ui/sheet";
import { Switch } from "@/shared/ui/switch";
import { Textarea } from "@/shared/ui/textarea";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, Lock, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ExceptionDate, TimeSlot } from "../model/types";

interface InspectorPanelProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDates: Date[];
    existingExceptions: ExceptionDate[]; // Pass all to find relevant ones
    onSave: (config: Partial<ExceptionDate>) => void;
    onDelete: () => void;
}

export function InspectorPanel({
    isOpen,
    onClose,
    selectedDates,
    existingExceptions,
    onSave,
    onDelete
}: InspectorPanelProps) {
    // Derived state
    const currentExceptions = useMemo(() => {
        const dateStrings = new Set(selectedDates.map(d => format(d, 'yyyy-MM-dd')));
        return existingExceptions.filter(e => dateStrings.has(format(e.date, 'yyyy-MM-dd')));
    }, [selectedDates, existingExceptions]);

    // Form State
    const [reason, setReason] = useState("");
    const [type, setType] = useState<'holiday' | 'maintenance' | 'custom'>('custom');
    const [isClosed, setIsClosed] = useState(true);
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

    // Mixed State Flags
    const [mixedReason, setMixedReason] = useState(false);
    const [mixedType, setMixedType] = useState(false);
    const [mixedIsClosed, setMixedIsClosed] = useState(false);

    // Initialize/Reset form on open/selection change
    useEffect(() => {
        if (selectedDates.length === 0) return;

        if (currentExceptions.length === 0) {
            // New items default
            setReason("Sự kiện mới");
            setType("custom");
            setIsClosed(true);
            setTimeSlots([{ start: "08:00", end: "17:00" }]);
            setMixedReason(false); setMixedType(false); setMixedIsClosed(false);
            return;
        }

        const first = currentExceptions[0];

        // Reason
        const allSameReason = currentExceptions.every(e => e.reason === first.reason);
        setReason(allSameReason ? first.reason : "");
        setMixedReason(!allSameReason);

        // Type
        const allSameType = currentExceptions.every(e => e.type === first.type);
        setType(allSameType ? first.type : 'custom');
        setMixedType(!allSameType);

        // IsClosed
        const allSameClosed = currentExceptions.every(e => e.isClosed === first.isClosed);
        setIsClosed(allSameClosed ? first.isClosed : true);
        setMixedIsClosed(!allSameClosed);

        // Slots (Complex check, for now just load first if exists, else default)
        // Ideally we check equality of slots arrays.
        setTimeSlots(first.modifiedHours || []);

    }, [selectedDates, currentExceptions, isOpen]);

    const handleSave = () => {
        onSave({
            reason: reason || (mixedReason ? undefined : "Sự kiện"), // If mixed and unchanged, keep undefined (handled by bulk op?)
            // actually bulk apply will overwrite.
            // If mixedReason is true, and user didn't type anything, we probably shouldn't overwrite reason?
            // This requires `applyExceptionToDates` to handle partial updates cleanly.
            // For now, let's assume if user hits save, they want to apply current form state.
            // But if it was mixed, and input is empty...
            // Let's rely on `onSave` logic.
            type,
            isClosed,
            modifiedHours: isClosed ? [] : timeSlots
        });
        onClose();
    };

    if (!isOpen) return null;

    const title = selectedDates.length === 1
        ? format(selectedDates[0], "EEEE, dd 'tháng' MM, yyyy", { locale: vi })
        : `${selectedDates.length} ngày đã chọn`;

    return (
        <Sheet open={isOpen} onOpenChange={onClose} modal={false}>
            <SheetContent side="right" className="w-[400px] sm:w-[540px] p-0 flex flex-col gap-0 border-l shadow-2xl z-[100]">
                {/* Header */}
                <div className="bg-muted/30 p-6 border-b flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2 text-primary font-semibold">
                             <CalendarIcon className="w-5 h-5" />
                             <span className="capitalize">{title}</span>
                         </div>
                         {/* Close button handled by Sheet */}
                    </div>
                    {/* Event Name Input (Big) */}
                    <div>
                         <Input
                            value={reason}
                            onChange={e => { setReason(e.target.value); setMixedReason(false); }}
                            placeholder={mixedReason ? "--- (Nhiều giá trị) ---" : "Tên sự kiện..."}
                            className="text-lg font-bold border-none shadow-none bg-transparent px-0 h-auto focus-visible:ring-0 placeholder:font-normal"
                         />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Type Selection */}
                    <div className="space-y-3">
                        <Label className="text-muted-foreground uppercase text-xs font-bold tracking-wider">Phân loại</Label>
                        <RadioGroup value={mixedType ? "" : type} onValueChange={(v:any) => { setType(v); setMixedType(false); }} className="grid grid-cols-3 gap-3">
                            <Label className={cn(
                                "flex flex-col items-center justify-center gap-2 border rounded-xl p-3 cursor-pointer hover:bg-muted/50 transition-all",
                                type === 'holiday' && !mixedType && "border-destructive/50 bg-destructive/10 text-destructive shadow-sm"
                            )}>
                                <RadioGroupItem value="holiday" className="sr-only" />
                                <span className="text-xl">⛔</span>
                                <span className="font-semibold text-sm">Nghỉ lễ</span>
                            </Label>
                             <Label className={cn(
                                "flex flex-col items-center justify-center gap-2 border rounded-xl p-3 cursor-pointer hover:bg-muted/50 transition-all",
                                type === 'maintenance' && !mixedType && "border-amber-500/50 bg-amber-500/10 text-amber-700 shadow-sm"
                            )}>
                                <RadioGroupItem value="maintenance" className="sr-only" />
                                <span className="text-xl">🚧</span>
                                <span className="font-semibold text-sm">Bảo trì</span>
                            </Label>
                             <Label className={cn(
                                "flex flex-col items-center justify-center gap-2 border rounded-xl p-3 cursor-pointer hover:bg-muted/50 transition-all",
                                type === 'custom' && !mixedType && "border-primary/50 bg-primary/10 text-primary shadow-sm"
                            )}>
                                <RadioGroupItem value="custom" className="sr-only" />
                                <span className="text-xl">✨</span>
                                <span className="font-semibold text-sm">Tùy chỉnh</span>
                            </Label>
                        </RadioGroup>
                    </div>

                    {/* Status & Hours */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base font-medium flex items-center gap-2">
                                    <Lock className="w-4 h-4" /> Đóng cửa cả ngày
                                </Label>
                                <p className="text-xs text-muted-foreground">Không nhận lịch đặt hẹn vào ngày này</p>
                            </div>
                            <Switch
                                checked={isClosed}
                                onCheckedChange={(c) => { setIsClosed(c); setMixedIsClosed(false); }}
                                aria-label="Toggle closed"
                            />
                        </div>

                        {!isClosed && (
                            <div className="border rounded-xl p-4 space-y-4 bg-muted/20 animate-in slide-in-from-top-2">
                                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground pb-2 border-b">
                                    <Clock className="w-4 h-4" /> Khung giờ mở cửa đặc biệt
                                </div>
                                {/* Simple Time Slot List */}
                                <div className="space-y-2">
                                    {timeSlots.map((slot, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <TimeInput value={slot.start} onChange={e => {
                                                const newSlots = [...timeSlots];
                                                newSlots[idx].start = e.target.value;
                                                setTimeSlots(newSlots);
                                            }} className="w-32" />
                                            <span>-</span>
                                             <TimeInput value={slot.end} onChange={e => {
                                                const newSlots = [...timeSlots];
                                                newSlots[idx].end = e.target.value;
                                                setTimeSlots(newSlots);
                                            }} className="w-32" />
                                            {/* Delete slot button if needed */}
                                        </div>
                                    ))}
                                    {/* Add Slot Button or logic */}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Internal Note */}
                    <div className="space-y-3">
                         <Label className="text-muted-foreground uppercase text-xs font-bold tracking-wider">Ghi chú nội bộ</Label>
                         <Textarea placeholder="Lưu ý cho nhân viên..." className="resize-none h-24" />
                    </div>
                </div>

                <SheetFooter className="p-6 border-t bg-muted/10 sm:justify-between">
                    <Button variant="ghost" className="text-destructive hover:bg-destructive/10 gap-2" onClick={onDelete}>
                        <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Xóa</span>
                    </Button>
                    <div className="flex gap-2">
                         <Button variant="outline" onClick={onClose}>Hủy</Button>
                         <Button onClick={handleSave} className="gap-2">
                            <Save className="w-4 h-4" /> Lưu thay đổi
                         </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
