"use client";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Textarea } from "@/shared/ui/textarea";
import { useEffect, useState } from "react";
import { NotificationTemplate } from "../model/types";

interface TemplateEditorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  template?: NotificationTemplate;
  onSave: (newTemplate: NotificationTemplate) => void;
  isSaving?: boolean;
}

export function TemplateEditor({
  isOpen,
  onOpenChange,
  title,
  template,
  onSave,
  isSaving = false,
}: TemplateEditorProps) {
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("");

  // Reset state when template changes or dialog opens
  useEffect(() => {
    if (template) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setContent(prev => prev !== template.content ? template.content : prev);

      setSubject(prev => prev !== (template.subject || "") ? (template.subject || "") : prev);
    } else {

      setContent(prev => prev !== "" ? "" : prev);

      setSubject(prev => prev !== "" ? "" : prev);
    }
  }, [template, isOpen]);

  const handleInsertVariable = (variable: string) => {
    // Simple insertion at end for now, in real app use cursor position
    setContent((prev) => prev + ` {{${variable}}} `);
  };

  const handleSave = () => {
    if (!template) return;
    onSave({
      ...template,
      content,
      subject: subject || undefined,
    });
    // Note: Parent handles close after success
  };

  if (!template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa mẫu tin: {title}</DialogTitle>
          <DialogDescription>
            Tùy chỉnh nội dung tin nhắn gửi đi. Sử dụng các biến để chèn dữ liệu động.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Subject Field (Only for Email) */}
          {(template.subject !== undefined || title.includes("Email")) && (
             <div className="grid gap-2">
              <Label htmlFor="subject">Tiêu đề (Email Subject)</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Nhập tiêu đề email..."
              />
            </div>
          )}

          {/* Content Field */}
          <div className="grid gap-2">
            <div className="flex justify-between">
                <Label htmlFor="content">Nội dung</Label>
                <span className="text-xs text-muted-foreground">
                    {content.length} ký tự
                </span>
            </div>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung tin nhắn..."
              className="min-h-[200px] font-mono text-sm"
            />
          </div>

          {/* Variables List */}
          <div className="grid gap-2">
            <Label>Biến có sẵn (Nhấn để chèn)</Label>
            <ScrollArea className="h-[100px] w-full rounded-md border p-4 bg-muted/50">
              <div className="flex flex-wrap gap-2">
                {template.variables.map((variable) => (
                  <Badge
                    key={variable}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleInsertVariable(variable)}
                  >
                    {`{{${variable}}}`}
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
