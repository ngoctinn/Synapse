"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui";
import { CustomerTreatment } from "../types";
import { Badge } from "@/shared/ui/badge";
import { Progress } from "@/shared/ui/progress";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Calendar, User, Package, Clock, StickyNote, Edit3, Save, X } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useState, useEffect } from "react";

interface TreatmentSheetProps {
  mode: "create" | "edit" | "view"; // Currently only view details implemented
  data?: CustomerTreatment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TreatmentSheet({
  mode,
  data,
  open,
  onOpenChange,
}: TreatmentSheetProps) {
  const [isEditing, setIsEditing] = useState(mode === "edit");
  const [editedNotes, setEditedNotes] = useState(data?.notes || "");
  const [prevDataId, setPrevDataId] = useState(data?.id);

  // Sync state with props during render (React pattern)
  if (data && data.id !== prevDataId) {
    setPrevDataId(data.id);
    setEditedNotes(data.notes || "");
  }

  if (!data) return null;

  const handleSaveNotes = () => {
    // Mock save logic
    console.log("Saving notes for treatment:", data.id, editedNotes);
    setIsEditing(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 gap-0 flex flex-col bg-background border-l shadow-2xl">
        <SheetHeader className="px-6 py-4 border-b shrink-0 bg-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="uppercase text-[10px] tracking-wider font-semibold">
              {data.id.split('_')[0].toUpperCase()}
            </Badge>
            <span className="text-xs text-muted-foreground ml-auto">
              {format(new Date(data.created_at), "dd MMM yyyy, HH:mm", { locale: vi })}
            </span>
          </div>
          <SheetTitle className="text-xl font-bold text-foreground">
            {isEditing ? "Chỉnh sửa ghi chú" : "Chi tiết liệu trình"}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Main Info */}
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <User className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Khách hàng</p>
                <p className="text-lg font-semibold">{data.customer_name}</p>
                {/* <p className="text-xs text-muted-foreground font-mono mt-0.5">{data.customer_id}</p> */}
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
              <div className="p-2 rounded-full bg-secondary/20 text-secondary-foreground">
                <Package className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gói dịch vụ</p>
                <p className="text-lg font-semibold">{data.package_name}</p>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Clock className="size-4" /> Tiến độ thực hiện
            </h3>
            <div className="space-y-2 p-4 rounded-lg bg-muted/30 border">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <span className="text-2xl font-bold">{data.sessions_completed}</span>
                  <span className="text-muted-foreground text-sm">/{data.total_sessions} buổi</span>
                </div>
                <Badge variant={data.status === 'active' ? 'success' : 'secondary'}>
                  {data.status === 'active' ? 'Đang thực hiện' : data.status}
                </Badge>
              </div>
              <Progress value={data.progress} className="h-3" />
            </div>
          </div>

          {/* Times */}
          <div className="grid grid-cols-2 gap-4 pb-6">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="size-3" /> Ngày bắt đầu
              </p>
              <p className="text-sm font-medium">
                {format(new Date(data.start_date), "dd/MM/yyyy", { locale: vi })}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="size-3" /> Hết hạn
              </p>
              <p className="text-sm font-medium">
                {format(new Date(data.expiry_date), "dd/MM/yyyy", { locale: vi })}
              </p>
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <StickyNote className="size-4" /> Ghi chú chuyên môn
              </h3>
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs gap-1.5"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 className="size-3" /> Chỉnh sửa
                </Button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <Textarea
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  placeholder="Nhập ghi chú chi tiết về tình trạng da, phản ứng của khách..."
                  className="min-h-[120px] text-sm leading-relaxed"
                />
                <div className="flex items-center gap-2">
                  <Button size="sm" className="flex-1 gap-2" onClick={handleSaveNotes}>
                    <Save className="size-4" /> Lưu ghi chú
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                    <X className="size-4" /> Hủy
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-900/30 rounded-xl text-sm leading-relaxed text-muted-foreground italic">
                {data.notes ? (
                  `"${data.notes}"`
                ) : (
                  "Chưa có ghi chú chuyên môn cho liệu trình này."
                )}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
