"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

/**
 * State từ useActionState
 */
interface ActionState {
  success?: boolean;
  message?: string;
  error?: string;
}

/**
 * Options cho useActionStateHandler
 */
interface UseActionStateHandlerOptions {
  /** State từ useActionState */
  state: ActionState;

  /** Callback khi action thành công */
  onSuccess?: () => void;

  /** Callback khi action thất bại */
  onError?: () => void;

  /** Title cho success toast */
  successTitle?: string;

  /** Title cho error toast */
  errorTitle?: string;

  /** Dependencies để track state changes */
  deps?: unknown[];
}

/**
 * Custom hook để xử lý state từ useActionState.
 * Tự động hiển thị toast và gọi callbacks dựa trên state.
 *
 * @example
 * ```tsx
 * const [state, dispatch, isPending] = React.useActionState(manageStaff, initialState)
 *
 * useActionStateHandler({
 *   state,
 *   onSuccess: () => onOpenChange(false),
 *   successTitle: "Đã cập nhật thành công",
 *   errorTitle: "Cập nhật thất bại",
 * })
 * ```
 */
export function useActionStateHandler(options: UseActionStateHandlerOptions) {
  const {
    state,
    onSuccess,
    onError,
    successTitle = "Thành công",
    errorTitle = "Thất bại",
  } = options;

  // Track previous state để tránh duplicate toasts
  const prevStateRef = useRef<ActionState | null>(null);

  useEffect(() => {
    // Skip nếu state không thay đổi
    if (prevStateRef.current === state) return;

    // Skip state ban đầu (empty)
    if (!state.success && !state.error && !state.message) return;

    prevStateRef.current = state;

    if (state.success && state.message) {
      toast.success(successTitle, {
        description: state.message,
      });
      onSuccess?.();
    } else if (state.error) {
      toast.error(errorTitle, {
        description: state.error,
      });
      onError?.();
    }
  }, [state, onSuccess, onError, successTitle, errorTitle]);
}
