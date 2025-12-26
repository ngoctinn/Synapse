"use client";

import { Button } from "@/shared/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Save } from "lucide-react";

interface BulkSaveBarProps {
  open: boolean;
  changeCount: number;
  onSave: () => void;
  onReset: () => void;
}

export function BulkSaveBar({
  open,
  changeCount,
  onSave,
  onReset,
}: BulkSaveBarProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
        >
          <div className="bg-foreground text-background flex items-center gap-4 rounded-full px-6 py-3 shadow-lg">
            <span className="text-sm font-medium">
              Bạn đã thay đổi {changeCount} quyền hạn
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={onReset}
                startContent={<RotateCcw className="size-4" />}
              >
                Hoàn tác
              </Button>
              <Button
                size="sm"
                onClick={onSave}
                startContent={<Save className="size-4" />}
              >
                Lưu thay đổi
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
