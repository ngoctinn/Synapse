import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Box, HStack, VStack } from "@/shared/ui/layout";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle
} from "@/shared/ui/sheet";
import { Loader2, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { MOCK_SKILLS } from "../../model/mocks";
import { Skill } from "../../model/types";

interface SkillManagerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSkillsChange?: (skills: Skill[]) => void;
}

export function SkillManagerSheet({
  open,
  onOpenChange,
  onSkillsChange,
}: SkillManagerSheetProps) {
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex h-full w-full flex-col sm:max-w-3xl">
        <SheetHeader>
          <SheetTitle>Quản lý Kỹ năng</SheetTitle>
          <SheetDescription>
             Quản lý danh sách kỹ năng chuyên môn của nhân viên.
          </SheetDescription>
        </SheetHeader>

        <HStack gap={0} className="mt-4 flex-1 overflow-hidden border rounded-md">
            {/* Left Column: List */}
            <VStack gap={0} className="w-1/3 min-w-[250px] border-r bg-muted/10">
              <Box className="border-b p-3 bg-background/50 backdrop-blur">
                <Input
                  placeholder="Tìm kiếm kỹ năng..."
                  className="bg-background"
                />
              </Box>
              <VStack gap={2} className="flex-1 overflow-y-auto p-3">
                {skills.length === 0 ? (
                  <Box className="py-8 text-center text-sm text-muted-foreground">
                    Chưa có kỹ năng nào.
                  </Box>
                ) : (
                  skills.map((skill) => (
                    <HStack
                      key={skill.id}
                      align="start"
                      justify="between"
                      className={cn(
                        "cursor-pointer rounded-lg border p-3 transition-all hover:shadow-sm",
                        editingId === skill.id
                          ? "bg-primary/5 border-primary ring-primary/20 ring-1"
                          : "bg-card hover:bg-accent/50 hover:border-accent-foreground/20"
                      )}
                      onClick={() => handleEdit(skill)}
                    >
                      <VStack gap={1} className="flex-1 min-w-0">
                         <span className="truncate text-sm font-medium">
                            {skill.name}
                          </span>
                        <Badge
                          variant="outline"
                          className="w-fit px-1.5 font-mono text-xs bg-background/50 text-muted-foreground h-5"
                        >
                          {skill.code}
                        </Badge>
                      </VStack>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="-mr-2 h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(skill.id);
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </HStack>
                  ))
                )}
              </VStack>
              <Box className="border-t p-3 text-center text-xs text-muted-foreground bg-background/50">
                {skills.length} kỹ năng trong hệ thống
              </Box>
            </VStack>

            {/* Right Column: Add/Edit Form */}
            <VStack className="flex-1 bg-background h-full overflow-hidden">
               <VStack gap={6} className="h-full overflow-y-auto p-6">
                <HStack justify="between" align="center">
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    {editingId ? (
                      <Pencil className="size-4 text-primary" />
                    ) : (
                      <Plus className="size-4 text-primary" />
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
                      <Plus className="size-4 mr-2" /> Tạo mới
                    </Button>
                  )}
                </HStack>

                <VStack gap={4}>
                  <VStack gap={4}>
                    <VStack gap={2}>
                      <Label>
                        Tên kỹ năng <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ví dụ: Massage Mặt"
                      />
                    </VStack>
                    <VStack gap={2}>
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
                    </VStack>
                    <VStack gap={2}>
                      <Label>Mô tả chi tiết</Label>
                      <Input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Mô tả ngắn về kỹ năng..."
                        onKeyDown={(e) => e.key === "Enter" && handleSaveItem()}
                      />
                    </VStack>
                  </VStack>

                  <HStack justify="end" className="pt-4">
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
                      className="min-w-24"
                    >
                      {editingId ? "Cập nhật" : "Thêm vào danh sách"}
                    </Button>
                  </HStack>
                </VStack>
              </VStack>
            </VStack>
          </HStack>

          <SheetFooter className="mt-4 gap-2 sm:gap-0">
            {hasChanges && (
              <Box className="flex-1 pl-2 text-sm font-medium text-amber-600 animate-pulse flex items-center">
                * Có thay đổi chưa lưu
              </Box>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
            <Button onClick={handleSaveAll} disabled={!hasChanges && !isSaving}>
              {isSaving ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Save className="mr-2 size-4" />
              )}
              Lưu tất cả thay đổi
            </Button>
          </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
