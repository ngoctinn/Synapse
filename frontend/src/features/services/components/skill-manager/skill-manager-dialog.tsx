"use client";

import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Loader2, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { MOCK_SKILLS } from "../../model/mocks";
import { Skill } from "../../model/types";

interface SkillManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSkillsChange?: (skills: Skill[]) => void;
}

export function SkillManagerDialog({
  open,
  onOpenChange,
  onSkillsChange,
}: SkillManagerDialogProps) {
  const [skills, setSkills] = useState<Skill[]>(MOCK_SKILLS);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setHasChanges(false);
      setEditingId(null);
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setName("");
    setCode("");
    setDescription("");
    setEditingId(null);
  };

  const handleEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setName(skill.name);
    setCode(skill.code);
    setDescription(skill.description || "");
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc muốn xóa kỹ năng này?")) {
      setSkills(skills.filter((s) => s.id !== id));
      setHasChanges(true);
      if (editingId === id) resetForm();
    }
  };

  const handleSaveItem = () => {
    if (!name.trim() || !code.trim()) return;

    if (editingId) {
      // Update existing
      setSkills(
        skills.map((s) =>
          s.id === editingId ? { ...s, name, code, description } : s
        )
      );
    } else {
      // Create new
      const newSkill: Skill = {
        id: `s_${uuidv4().slice(0, 8)}`,
        name: name.trim(),
        code: code.trim().toUpperCase(),
        description: description.trim() || undefined,
      };
      setSkills([...skills, newSkill]);
    }

    setHasChanges(true);
    resetForm();
    toast.success(editingId ? "Đã cập nhật kỹ năng" : "Đã thêm kỹ năng");
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      onSkillsChange?.(skills);
      setHasChanges(false);
      toast.success("Đã lưu thay đổi kỹ năng");
      onOpenChange(false);
    } catch {
      toast.error("Lỗi khi lưu kỹ năng");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[480px] flex-col gap-0 p-0 sm:max-w-3xl">
        <DialogHeader className="shrink-0 space-y-0 border-b px-6 py-4">
          <DialogTitle className="text-lg">Quản lý Kỹ năng</DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Column: List - 45% width */}
          <div className="bg-muted/10 flex w-[45%] min-w-[260px] flex-col border-r">
            <div className="bg-background/50 border-b p-3 backdrop-blur">
              <div className="relative">
                <Input
                  placeholder="Tìm kiếm kỹ năng..."
                  className="bg-background"
                />
              </div>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto p-3">
              {skills.length === 0 ? (
                <div className="text-muted-foreground py-8 text-center text-sm">
                  Chưa có kỹ năng nào.
                </div>
              ) : (
                skills.map((skill) => (
                  <div
                    key={skill.id}
                    className={cn(
                      "flex cursor-pointer items-start justify-between rounded-lg border p-3 transition-all hover:shadow-sm",
                      editingId === skill.id
                        ? "bg-primary/5 border-primary ring-primary/20 ring-1"
                        : "bg-card hover:bg-accent/50 hover:border-accent-foreground/20"
                    )}
                    onClick={() => handleEdit(skill)}
                  >
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium">
                          {skill.name}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-muted-foreground bg-background/50 h-5 w-fit px-1.5 font-mono text-[11px]"
                      >
                        {skill.code}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive -mr-2 h-8 w-8 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(skill.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
            <div className="bg-background/50 text-muted-foreground border-t p-3 text-center text-xs">
              {skills.length} kỹ năng trong hệ thống
            </div>
          </div>

          {/* Right Column: Add/Edit Form */}
          <div className="bg-background flex flex-1 flex-col">
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-base font-semibold">
                  {editingId ? (
                    <Pencil className="text-primary h-4 w-4" />
                  ) : (
                    <Plus className="text-primary h-4 w-4" />
                  )}
                  {editingId ? "Chỉnh sửa thông tin" : "Thêm kỹ năng mới"}
                </h3>
                {editingId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetForm}
                    className="ml-auto"
                  >
                    <Plus className="h-4 w-4" /> Tạo mới
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>
                      Tên kỹ năng <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ví dụ: Massage Mặt"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Mã tham chiếu (Code){" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="Ví dụ: FACIAL"
                      className="font-mono uppercase"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mô tả chi tiết</Label>
                    <Input
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Mô tả ngắn về kỹ năng..."
                      onKeyDown={(e) => e.key === "Enter" && handleSaveItem()}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  {editingId && (
                    <Button
                      variant="outline"
                      className="mr-2"
                      onClick={resetForm}
                    >
                      Hủy bỏ
                    </Button>
                  )}
                  <Button
                    onClick={handleSaveItem}
                    disabled={!name.trim() || !code.trim()}
                    className="min-w-[100px]"
                  >
                    {editingId ? "Cập nhật" : "Thêm vào danh sách"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="bg-background shrink-0 border-t p-4">
          {hasChanges && (
            <div className="flex flex-1 animate-pulse items-center pl-2 text-sm font-medium text-amber-600">
              * Có thay đổi chưa lưu
            </div>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          <Button onClick={handleSaveAll} disabled={!hasChanges && !isSaving}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Lưu tất cả thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
