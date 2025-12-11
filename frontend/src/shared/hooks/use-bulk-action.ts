"use client"

import { useRouter } from "next/navigation"
import { useCallback, useState, useTransition } from "react"
import { toast } from "sonner"

interface BulkActionOptions {
  /** Success message formatter */
  successMessage?: (count: number) => string
  /** Error message formatter */
  errorMessage?: (count: number) => string
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
  actionFn: (id: T) => Promise<{ success: boolean }>,
  options: BulkActionOptions = {}
): UseBulkActionReturn<T> {
  const {
    successMessage = (count) => `Đã xử lý ${count} mục`,
    errorMessage = (count) => `Không thể xử lý ${count} mục`,
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

        for (const id of ids) {
          try {
            const result = await actionFn(id)
            if (result.success) successCount++
          } catch (error) {
            console.error(`Failed to process ${id}:`, error)
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
        if (successCount < ids.length) {
          toast.error(errorMessage(ids.length - successCount))
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
