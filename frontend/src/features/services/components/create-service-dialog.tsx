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
import { Skill } from "../types";
import { ServiceForm } from "./service-form";

interface CreateServiceDialogProps {
  availableSkills: Skill[];
}

export function CreateServiceDialog({ availableSkills }: CreateServiceDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Thêm dịch vụ
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm Dịch vụ Mới</DialogTitle>
          <DialogDescription>
            Tạo dịch vụ mới và gán các kỹ năng yêu cầu.
          </DialogDescription>
        </DialogHeader>
        <ServiceForm
            availableSkills={availableSkills}
            onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
