"use client"

import { ActionResponse } from "@/shared/lib/action-response"
import { useRouter } from "next/navigation"
import { useCallback, useState, useTransition } from "react"
import { toast } from "sonner"

interface BulkActionOptions {
  /** Success message formatter */
  successMessage?: (count: number) => string
  /** Error message formatter */
  errorMessage?: (count: number, failedMessages?: string[]) => string
  /** Should refresh router after success */
  refreshOnSuccess?: boolean
}

interface UseBulkActionReturn<T extends string = string> {
  /** Execute bulk action on array of IDs */
  execute: (ids: T[], onComplete?: () => void) => void
  /** Whether the action is currently pending */
  isPending: boolean
  /** Dialog open state for confirmation */
  showDialog: boolean
  /** Set dialog open state */
  setShowDialog: (open: boolean) => void
}

/**
 * Custom hook để xử lý bulk actions (xóa nhiều items cùng lúc).
 * Tập trung logic lặp, toast notifications và error handling.
 *
 * @example
 * ```tsx
 * const { execute, isPending, showDialog, setShowDialog } = useBulkAction(deleteService, {
 *   successMessage: (count) => `Đã xóa ${count} dịch vụ`,
 *   errorMessage: (count) => `Không thể xóa ${count} dịch vụ`,
 * })
 *
 * // In dialog
 * <AlertDialogAction onClick={() => execute(ids, selection.clearAll)}>
 *   Xóa
 * </AlertDialogAction>
 * ```
 */
export function useBulkAction<T extends string = string>(
  actionFn: (id: T) => Promise<ActionResponse>,
  options: BulkActionOptions = {}
): UseBulkActionReturn<T> {
  const {
    successMessage = (count) => `Đã xử lý ${count} mục`,
    errorMessage = (count, failedMessages) => `Không thể xử lý ${count} mục. Chi tiết: ${failedMessages?.join(", ") || "Lỗi không xác định."}`,
    refreshOnSuccess = true,
  } = options

  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showDialog, setShowDialog] = useState(false)

  const execute = useCallback(
    (ids: T[], onComplete?: () => void) => {
      if (ids.length === 0) return

      startTransition(async () => {
        let successCount = 0
        const failedMessages: string[] = []

        for (const id of ids) {
          try {
            const result = await actionFn(id)
            if (result.status === "success") {
                successCount++
            } else {
                failedMessages.push(result.message || `Lỗi không xác định khi xử lý ${id}`)
            }
          } catch (error: unknown) {
            console.error(`Failed to process ${id}:`, error)
            const message = error instanceof Error ? error.message : "Lỗi không xác định";
            failedMessages.push(message || `Lỗi không xác định khi xử lý ${id}`)
          }
        }

        // Show success toast
        if (successCount > 0) {
          toast.success(successMessage(successCount))
          onComplete?.()
          if (refreshOnSuccess) {
            router.refresh()
          }
        }

        // Show error toast for failed items
        if (failedMessages.length > 0) {
          toast.error(errorMessage(failedMessages.length, failedMessages))
        }

        setShowDialog(false)
      })
    },
    [actionFn, successMessage, errorMessage, refreshOnSuccess, router]
  )

  return {
    execute,
    isPending,
    showDialog,
    setShowDialog,
  }
}
