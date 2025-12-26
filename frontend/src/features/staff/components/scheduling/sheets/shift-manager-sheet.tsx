"use client";

import { Clock, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { cn } from "@/shared/lib/utils";
import { Button, Input, Separator } from "@/shared/ui";
import { ActionSheet, Icon } from "@/shared/ui/custom";
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

import { MOCK_SHIFTS } from "../../../model/shifts";
import type { Shift } from "../../../model/types";

interface ShiftManagerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

import { ShiftItem } from "./components/shift-item";
import { ShiftForm } from "./components/shift-form";

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
  const [formColor, setFormColor] = useState("#D97706"); // Default to Amber

  const resetForm = () => {
    setFormName("");
    setFormStartTime("08:00");
    setFormEndTime("12:00");
    setFormColor("#D97706"); // Reset to default Amber
    setIsAdding(false);
    setEditingId(null);
  };

  // Kiểm tra xem form có đang dở dang không (Fix Phase 2)
  const isDirty = isAdding || !!editingId || formName !== "";

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
      <ActionSheet
        open={open}
        onOpenChange={onOpenChange}
        isDirty={isDirty}
        title="Quản lý ca làm việc"
        description="Tạo và chỉnh sửa các ca làm việc (Master Data)"
        footer={
          <Button
            variant="default"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Xong
          </Button>
        }
      >
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
            <ShiftForm
              title={editingId ? "Chỉnh sửa ca" : "Thêm ca mới"}
              name={formName}
              onNameChange={setFormName}
              startTime={formStartTime}
              onStartTimeChange={setFormStartTime}
              endTime={formEndTime}
              onEndTimeChange={setFormEndTime}
              color={formColor}
              onColorChange={setFormColor}
              onCancel={resetForm}
              onSubmit={editingId ? handleUpdate : handleAdd}
              submitLabel={editingId ? "Cập nhật" : "Thêm"}
            />
          )}

          {/* Add button */}
          {!isAdding && !editingId && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsAdding(true)}
            >
              <Icon icon={Plus} className="size-4" />
              Thêm ca mới
            </Button>
          )}
        </div>
      </ActionSheet>

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
              variant="destructive"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
