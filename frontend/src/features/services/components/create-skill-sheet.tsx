import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { Plus } from "lucide-react";
import { useState } from "react";
import { SkillForm } from "./skill-form";

export function CreateSkillSheet() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" startContent={<Plus className="size-4" />}>
          Thêm kỹ năng
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Thêm Kỹ năng Mới</SheetTitle>
          <SheetDescription>
            Tạo kỹ năng mới để gán cho dịch vụ và nhân viên.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <SkillForm onSuccess={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
