"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { TableRowActions } from "@/shared/ui/custom/table-row-actions";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { deleteSkill } from "../actions";
import { Skill } from "../types";
import { SkillForm } from "./skill-form";

interface SkillActionsProps {
  skill: Skill;
}

export function SkillActions({ skill }: SkillActionsProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      const result = await deleteSkill(skill.id);
      if (result.success) {
        toast.success("Đã xóa kỹ năng");
      } else {
        toast.error(result.message || "Không thể xóa kỹ năng");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
      console.error(error);
    }
  };

  return (
    <>
      <TableRowActions
        onEdit={() => setShowEditDialog(true)}
        onDelete={() => setShowDeleteDialog(true)}
      />

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Cập nhật Kỹ năng</DialogTitle>
            <DialogDescription>
              Chỉnh sửa thông tin kỹ năng.
            </DialogDescription>
          </DialogHeader>
          <SkillForm skill={skill} onSuccess={() => setShowEditDialog(false)} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Kỹ năng sẽ bị xóa khỏi hệ thống và gỡ bỏ khỏi các dịch vụ liên quan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
