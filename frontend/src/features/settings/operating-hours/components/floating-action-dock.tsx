
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Lock, Tag, Trash2, X } from "lucide-react";
// import { TimeSlotInput } from "./time-slot-input"; // Assuming you have or will build this
import { TimeInput } from "@/shared/ui/custom/time-input";
import { Label } from "@/shared/ui/label";
import { useState } from "react";

interface FloatingActionDockProps {
    selectedCount: number;
    onAction: (action: string, payload?: any) => void;
    onClearSelection: () => void;
}

export function FloatingActionDock({ selectedCount, onAction, onClearSelection }: FloatingActionDockProps) {
    const [timeRange, setTimeRange] = useState({ start: "08:00", end: "17:00" });
    const [tagReason, setTagReason] = useState("");

    if (selectedCount === 0) return null;

    return (
        <AnimatePresence>
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4 pointer-events-none">
                <motion.div
                    initial={{ y: 100, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 100, opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="pointer-events-auto bg-foreground/95 backdrop-blur-md text-secondary rounded-2xl shadow-2xl p-2 flex items-center justify-between gap-4 ring-1 ring-white/10 dark:ring-white/20"
                >
                    <div className="flex items-center gap-3 pl-4">
                        <div className="flex items-center justify-center bg-primary text-primary-foreground font-bold h-8 w-8 rounded-full text-xs">
                            {selectedCount}
                        </div>
                        <span className="font-medium text-sm text-secondary-foreground whitespace-nowrap hidden sm:inline-block">
                            ngày đã chọn
                        </span>

                        <div className="h-8 w-px bg-white/20 mx-2" />

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClearSelection}
                            className="text-secondary-foreground/70 hover:text-white hover:bg-white/10 h-8 px-2"
                        >
                            <X className="w-4 h-4 mr-1" />
                            Hủy
                        </Button>
                    </div>

                    <div className="flex items-center gap-1 pr-1">
                        <TooltipButton
                            icon={<Lock className="w-4 h-4" />}
                            label="Đóng cửa"
                            onClick={() => onAction('lock')}
                            className="hover:bg-destructive hover:text-white"
                        />

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm" className="px-3 text-secondary-foreground hover:bg-white/10 gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span className="hidden sm:inline">Giờ</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-4 mb-2" sideOffset={10}>
                                <div className="space-y-4">
                                    <h4 className="font-medium leading-none">Đặt giờ mở cửa</h4>
                                    <div className="grid gap-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                                <Label>Bắt đầu</Label>
                                                <TimeInput
                                                    value={timeRange.start}
                                                    onChange={e => setTimeRange(p => ({...p, start: e.target.value}))}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label>Kết thúc</Label>
                                                <TimeInput
                                                    value={timeRange.end}
                                                    onChange={e => setTimeRange(p => ({...p, end: e.target.value}))}
                                                />
                                            </div>
                                        </div>
                                        <Button size="sm" onClick={() => onAction('time', timeRange)}>
                                            Áp dụng ({selectedCount} ngày)
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>

                        <Popover>
                             <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm" className="px-3 text-secondary-foreground hover:bg-white/10 gap-2">
                                    <Tag className="w-4 h-4" />
                                    <span className="hidden sm:inline">Nhãn</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-60 p-2 mb-2">
                                <div className="flex flex-col gap-1">
                                    <Button variant="ghost" size="sm" className="justify-start" onClick={() => onAction('type', 'holiday')}>
                                        ⛔ Nghỉ lễ
                                    </Button>
                                    <Button variant="ghost" size="sm" className="justify-start" onClick={() => onAction('type', 'maintenance')}>
                                        🚧 Bảo trì
                                    </Button>
                                    <Button variant="ghost" size="sm" className="justify-start" onClick={() => onAction('type', 'custom')}>
                                        ✨ Sự kiện
                                    </Button>
                                    <div className="h-px bg-border my-1" />
                                     <Button variant="ghost" size="sm" className="justify-start text-destructive hover:bg-destructive/10" onClick={() => onAction('clear')}>
                                        <Trash2 className="w-4 h-4 mr-2" /> Xóa sự kiện
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

function TooltipButton({ icon, label, onClick, className }: any) {
    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={onClick}
            className={cn("h-9 px-3 text-secondary-foreground hover:bg-white/10 gap-2", className)}
        >
            {icon}
            <span className="hidden sm:inline">{label}</span>
        </Button>
    )
}
