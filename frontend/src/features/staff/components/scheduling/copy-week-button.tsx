"use client"

import { Button } from "@/shared/ui/button"
import { Copy } from "lucide-react"
import { toast } from "sonner"

interface CopyWeekButtonProps {
  onCopy: () => void
}

export function CopyWeekButton({ onCopy }: CopyWeekButtonProps) {
  const handleCopy = () => {
    // In a real app, this would call an API
    onCopy()
    toast.success("Đã sao chép lịch làm việc từ tuần trước", {
      description: "Dữ liệu đã được áp dụng cho tuần hiện tại.",
    })
  }

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      <Copy className="mr-2 h-4 w-4" />
      Sao chép tuần trước
    </Button>
  )
}
