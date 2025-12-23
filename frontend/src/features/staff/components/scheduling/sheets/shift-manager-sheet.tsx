"use client";

import { Clock, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { cn } from "@/shared/lib/utils";
import { Button, Input, Separator } from "@/shared/ui";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";

import { MOCK_SHIFTS } from "../../../model/shifts";
import type { Shift } from "../../../model/types";

interface ShiftManagerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DEFAULT_COLORS = [
  "#D97706", // Amber
  "#2563EB", // Blue
  "#7C3AED", // Violet
  "#059669", // Emerald
  "#DC2626", // Red
  "#EA580C", // Orange
  "#0891B2", // Cyan
];

/**
 * Shift item component - Style chữ đậm + nền nhạt
 */
function ShiftItem({
  shift,
  isEditing,
  onEdit,
  onDelete,
}: {
  shift: Shift;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg p-3 transition-all",
        isEditing ? "ring-primary ring-2 ring-offset-2" : ""
      )}
      style={{ backgroundColor: `${shift.colorCode}12` }}
    >
      <div
        className="h-10 w-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: shift.colorCode }}
      />
      <div className="min-w-0 flex-1">
        <div
          className="truncate font-semibold"
          style={{ color: shift.colorCode }}
        >
          {shift.name}
        </div>
        <div className="text-xs opacity-70" style={{ color: shift.colorCode }}>
          {shift.startTime} - {shift.endTime}
        </div>
      </div>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-white/50"
          onClick={onEdit}
        >
          <Pencil className="size-4" style={{ color: shift.colorCode }} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive h-8 w-8 hover:bg-white/50"
          onClick={onDelete}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}

/**
 * Sheet quản lý Master Data ca làm việc (CRUD)
 */
export function ShiftManagerSheet({
  open,
  onOpenChange,
}: ShiftManagerSheetProps) {
  // Local state cho shifts (mock)
  const [shifts, setShifts] = useState<Shift[]>(MOCK_SHIFTS);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formStartTime, setFormStartTime] = useState("08:00");
  const [formEndTime, setFormEndTime] = useState("12:00");
  const [formColor, setFormColor] = useState(DEFAULT_COLORS[0]);

  const resetForm = () => {
    setFormName("");
    setFormStartTime("08:00");
    setFormEndTime("12:00");
    setFormColor(DEFAULT_COLORS[0]);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleAdd = () => {
    if (!formName.trim()) {
      toast.error("Vui lòng nhập tên ca");
      return;
    }

    const newShift: Shift = {
      id: `shift_${Date.now()}`,
      name: formName.trim(),
      startTime: formStartTime,
      endTime: formEndTime,
      colorCode: formColor,
    };

    setShifts((prev) => [...prev, newShift]);
    toast.success("Đã thêm ca làm việc");
    resetForm();
  };

  const handleEdit = (shift: Shift) => {
    setEditingId(shift.id);
    setFormName(shift.name);
    setFormStartTime(shift.startTime);
    setFormEndTime(shift.endTime);
    setFormColor(shift.colorCode);
    setIsAdding(false);
  };

  const handleUpdate = () => {
    if (!formName.trim() || !editingId) return;

    setShifts((prev) =>
      prev.map((s) =>
        s.id === editingId
          ? {
              ...s,
              name: formName.trim(),
              startTime: formStartTime,
              endTime: formEndTime,
              colorCode: formColor,
            }
          : s
      )
    );
    toast.success("Đã cập nhật ca làm việc");
    resetForm();
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setShifts((prev) => prev.filter((s) => s.id !== deleteId));
    toast.success("Đã xóa ca làm việc");
    setDeleteId(null);
  };

  const shiftToDelete = shifts.find((s) => s.id === deleteId);

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="bg-background flex w-full flex-col gap-0 border-l p-0 shadow-2xl sm:max-w-lg">
          {/* Header */}
          <SheetHeader className="shrink-0 space-y-0 border-b px-6 py-4">
            <SheetTitle className="text-lg font-semibold">
              Quản lý ca làm việc
            </SheetTitle>
            <p className="text-muted-foreground mt-1 text-sm">
              Tạo và chỉnh sửa các ca làm việc (Master Data)
            </p>
          </SheetHeader>

          {/* Content */}
          <div className="sheet-scroll-area">
            <div className="space-y-4">
              {/* Shift list */}
              <div className="space-y-3">
                <h3 className="text-muted-foreground text-sm font-medium">
                  Danh sách ca
                </h3>
                <div className="space-y-2">
                  {shifts.map((shift) => (
                    <ShiftItem
                      key={shift.id}
                      shift={shift}
                      isEditing={editingId === shift.id}
                      onEdit={() => handleEdit(shift)}
                      onDelete={() => setDeleteId(shift.id)}
                    />
                  ))}
                </div>
              </div>

              <Separator />

              {/* Add/Edit form */}
              {(isAdding || editingId) && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">
                    {editingId ? "Chỉnh sửa ca" : "Thêm ca mới"}
                  </h3>

                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-muted-foreground text-sm">
                      Tên ca
                    </label>
                    <Input
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Ví dụ: Ca sáng, Ca tối..."
                      className="h-10"
                    />
                  </div>

                  {/* Time */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-muted-foreground text-sm">
                        Bắt đầu
                      </label>
                      <Input
                        type="time"
                        value={formStartTime}
                        onChange={(e) => setFormStartTime(e.target.value)}
                        startContent={<Clock className="size-4" />}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-muted-foreground text-sm">
                        Kết thúc
                      </label>
                      <Input
                        type="time"
                        value={formEndTime}
                        onChange={(e) => setFormEndTime(e.target.value)}
                        startContent={<Clock className="size-4" />}
                        className="h-10"
                      />
                    </div>
                  </div>

                  {/* Color */}
                  <div className="space-y-1.5">
                    <label className="text-muted-foreground text-sm">
                      Màu sắc
                    </label>
                    <div className="flex gap-2">
                      {DEFAULT_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormColor(color)}
                          className={cn(
                            "h-8 w-8 rounded-full transition-all",
                            formColor === color &&
                              "ring-primary ring-2 ring-offset-2"
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9"
                      onClick={resetForm}
                    >
                      Hủy
                    </Button>
                    <Button
                      size="sm"
                      className="h-9"
                      onClick={editingId ? handleUpdate : handleAdd}
                    >
                      {editingId ? "Cập nhật" : "Thêm"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Add button */}
              {!isAdding && !editingId && (
                <Button
                  variant="outline"
                  className="h-9 w-full"
                  onClick={() => setIsAdding(true)}
                >
                  <Plus className="mr-2 size-4" />
                  Thêm ca mới
                </Button>
              )}
            </div>
          </div>

          {/* Footer */}
          <SheetFooter className="bg-background border-t px-6 py-3">
            <Button
              variant="default"
              className="h-9 w-full"
              onClick={() => onOpenChange(false)}
            >
              Xong
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa ca <strong>{shiftToDelete?.name}</strong>?
              Các lịch đã phân công ca này sẽ bị ảnh hưởng.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
