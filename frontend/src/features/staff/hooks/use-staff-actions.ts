"use client"

import { deleteStaff } from "@/features/staff/actions"
import { showToast } from "@/shared/ui/custom/sonner"
import { useState, useTransition } from "react"

interface UseStaffActionsProps {
    onSuccess?: () => void
    onError?: () => void
}

export function useStaffActions({ onSuccess, onError }: UseStaffActionsProps = {}) {
    const [isPending, startTransition] = useTransition()
    const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)

    const handleBulkDelete = (ids: string[], clearSelection: () => void) => {
        if (ids.length === 0) return

        startTransition(async () => {
            try {
                let successCount = 0
                for (const id of ids) {
                    try {
                        const result = await deleteStaff(id)
                        if (result.status === "success") successCount++
                    } catch (e) {
                        console.error(`Failed to delete ${id}:`, e)
                    }
                }

                if (successCount > 0) {
                    showToast.success("Thành công", `Đã xóa ${successCount} nhân viên`)
                    clearSelection()
                    onSuccess?.()
                }

                if (successCount < ids.length) {
                    showToast.error("Lỗi", `Không thể xóa ${ids.length - successCount} nhân viên`)
                    onError?.()
                }
            } catch (error) {
                console.error(error)
                showToast.error("Lỗi", "Không thể xóa nhân viên")
                onError?.()
            } finally {
                setShowBulkDeleteDialog(false)
            }
        })
    }

    return {
        isPending,
        showBulkDeleteDialog,
        setShowBulkDeleteDialog,
        handleBulkDelete
    }
}
