"use client";

import { useDeleteAction } from "@/shared/hooks";
import { DeleteConfirmDialog } from "@/shared/ui";
import { TableRowActions } from "@/shared/ui/custom/table-row-actions";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/dialog";
import { useState } from "react";
import { deleteSkill } from "../actions";
import { Skill } from "../types";
import { SkillForm } from "./skill-form";

interface SkillActionsProps {
  skill: Skill;
}

export function SkillActions({ skill }: SkillActionsProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  const { handleDelete, dialogProps, openDeleteDialog, isPending } =
    useDeleteAction({
      deleteAction: deleteSkill,
      entityName: "kỹ năng",
    });

  return (
    <>
      <TableRowActions
        onEdit={() => setShowEditDialog(true)}
        onDelete={openDeleteDialog}
        disabled={isPending}
      />

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Cập nhật Kỹ năng</DialogTitle>
            <DialogDescription>Chỉnh sửa thông tin kỹ năng.</DialogDescription>
          </DialogHeader>
          <SkillForm skill={skill} onSuccess={() => setShowEditDialog(false)} />
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        {...dialogProps}
        onConfirm={() => handleDelete(skill.id)}
        entityName="kỹ năng"
        entityLabel={skill.name}
        description="Hành động này không thể hoàn tác. Kỹ năng sẽ bị xóa khỏi hệ thống và gỡ bỏ khỏi các dịch vụ liên quan."
      />
    </>
  );
}
