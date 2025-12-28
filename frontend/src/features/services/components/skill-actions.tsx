import { DeleteConfirmDialog } from "@/shared/components/delete-confirm-dialog";
import { TableRowActions } from "@/shared/components/table-row-actions";
import { useDeleteAction } from "@/shared/hooks";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/shared/ui/sheet";
import { useState } from "react";
import { deleteSkill } from "../actions";
import { Skill } from "../model/types";
import { SkillForm } from "./skill-form";

interface SkillActionsProps {
  skill: Skill;
}

export function SkillActions({ skill }: SkillActionsProps) {
  const [showEditSheet, setShowEditSheet] = useState(false);

  const { handleDelete, dialogProps, openDeleteDialog, isPending } =
    useDeleteAction({
      deleteAction: deleteSkill,
      entityName: "kỹ năng",
    });

  return (
    <>
      <TableRowActions
        onEdit={() => setShowEditSheet(true)}
        onDelete={openDeleteDialog}
        disabled={isPending}
      />

      <Sheet open={showEditSheet} onOpenChange={setShowEditSheet}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Cập nhật Kỹ năng</SheetTitle>
            <SheetDescription>Chỉnh sửa thông tin kỹ năng.</SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <SkillForm skill={skill} onSuccess={() => setShowEditSheet(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <DeleteConfirmDialog
        {...dialogProps}
        onConfirm={() => handleDelete(skill.id)}
        entityName="kỹ năng"
        entityLabel={skill.name}
      />
    </>
  );
}
