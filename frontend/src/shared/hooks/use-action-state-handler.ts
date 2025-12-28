"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

interface ActionState {
  success?: boolean;
  message?: string;
  error?: string;
}

interface UseActionStateHandlerOptions {
  state: ActionState;

  onSuccess?: () => void;

  onError?: () => void;

  successTitle?: string;

  errorTitle?: string;

  deps?: unknown[];
}

export function useActionStateHandler(options: UseActionStateHandlerOptions) {
  const {
    state,
    onSuccess,
    onError,
    successTitle = "Thành công",
    errorTitle = "Thất bại",
  } = options;

  const prevStateRef = useRef<ActionState | null>(null);

  useEffect(() => {
    if (prevStateRef.current === state) return;

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
