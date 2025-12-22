"use client";

import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
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
      setSkills(skills.filter(s => s.id !== id));
      setHasChanges(true);
      if (editingId === id) resetForm();
    }
  };

  const handleSaveItem = () => {
    if (!name.trim() || !code.trim()) return;

    if (editingId) {
      // Update existing
      setSkills(skills.map(s => s.id === editingId ? { ...s, name, code, description } : s));
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
      await new Promise(resolve => setTimeout(resolve, 800));
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
      <DialogContent className="sm:max-w-3xl flex flex-col h-[480px] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b shrink-0 space-y-0">
          <DialogTitle className="text-lg">Quản lý Kỹ năng</DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
            {/* Left Column: List - 45% width */}
            <div className="w-[45%] min-w-[260px] border-r flex flex-col bg-muted/10">
                <div className="p-3 border-b bg-background/50 backdrop-blur">
                   <div className="relative">
                        <Input
                            placeholder="Tìm kiếm kỹ năng..."
                            className="bg-background"
                        />
                   </div>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {skills.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                            Chưa có kỹ năng nào.
                        </div>
                    ) : (
                        skills.map((skill) => (
                            <div
                                key={skill.id}
                                className={cn(
                                    "flex items-start justify-between p-3 rounded-md border cursor-pointer transition-all hover:shadow-sm",
                                    editingId === skill.id
                                        ? "bg-primary/5 border-primary ring-1 ring-primary/20"
                                        : "bg-card hover:bg-accent/50 hover:border-accent-foreground/20"
                                )}
                                onClick={() => handleEdit(skill)}
                            >
                                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm truncate">{skill.name}</span>
                                    </div>
                                    <Badge variant="outline" className="w-fit text-[11px] h-5 px-1.5 font-mono text-muted-foreground bg-background/50">
                                        {skill.code}
                                    </Badge>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0 -mr-2"
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
                <div className="p-3 border-t bg-background/50 text-xs text-muted-foreground text-center">
                    {skills.length} kỹ năng trong hệ thống
                </div>
            </div>

            {/* Right Column: Add/Edit Form */}
            <div className="flex-1 flex flex-col bg-background">
                <div className="p-6 flex-1 overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-base flex items-center gap-2">
                            {editingId ? <Pencil className="w-4 h-4 text-primary"/> : <Plus className="w-4 h-4 text-primary"/>}
                            {editingId ? "Chỉnh sửa thông tin" : "Thêm kỹ năng mới"}
                        </h3>
                        {editingId && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={resetForm}
                                className="ml-auto"
                            >
                                <Plus className="w-4 h-4 mr-1" /> Tạo mới
                            </Button>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label>Tên kỹ năng <span className="text-destructive">*</span></Label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ví dụ: Massage Mặt"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Mã tham chiếu (Code) <span className="text-destructive">*</span></Label>
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

                        <div className="pt-4 flex justify-end">
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

        <DialogFooter className="p-4 border-t bg-background shrink-0">
         {hasChanges && (
            <div className="flex-1 flex items-center text-amber-600 text-sm font-medium animate-pulse pl-2">
                * Có thay đổi chưa lưu
            </div>
         )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          <Button onClick={handleSaveAll} disabled={!hasChanges && !isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Lưu tất cả thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
