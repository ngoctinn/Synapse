"use client"

import { Button } from "@/shared/ui/button"
import { showToast } from "@/shared/ui/custom/sonner"
import { Copy } from "lucide-react"

interface CopyWeekButtonProps {
  onCopy: () => void
}

export function CopyWeekButton({ onCopy }: CopyWeekButtonProps) {
  const handleCopy = () => {

    onCopy()
    showToast.success("Đã sao chép lịch làm việc từ tuần trước", "Dữ liệu đã được áp dụng cho tuần hiện tại.")
  }

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      <Copy className="mr-2 h-4 w-4" />
      Sao chép tuần trước
    </Button>
  )
}
