"use client";

import { Button } from "@/shared/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { SkillForm } from "./skill-form";

export function CreateSkillDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Thêm kỹ năng
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Thêm Kỹ năng Mới</DialogTitle>
          <DialogDescription>
            Tạo kỹ năng mới để gán cho dịch vụ và nhân viên.
          </DialogDescription>
        </DialogHeader>
        <SkillForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
