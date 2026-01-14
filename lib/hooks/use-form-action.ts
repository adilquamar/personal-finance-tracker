"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { isRedirectError } from "next/dist/client/components/redirect"
import type { ActionResult } from "@/lib/auth"

/**
 * Options for the useFormAction hook
 */
interface UseFormActionOptions<TData> {
  /**
   * Callback when action succeeds
   * @param data - The data returned from the action (if any)
   */
  onSuccess?: (data?: TData) => void

  /**
   * Callback when action fails
   * @param error - The error message
   */
  onError?: (error: string) => void

  /**
   * Success toast message. Set to false to disable success toast.
   * @default undefined (no toast)
   */
  successMessage?: string | false

  /**
   * Error toast message. Set to false to disable error toast.
   * Uses action error message by default.
   * @default undefined (uses action error)
   */
  errorMessage?: string | false

  /**
   * Generic error message for unexpected errors
   * @default "An unexpected error occurred. Please try again."
   */
  unexpectedErrorMessage?: string

  /**
   * Whether to call router.refresh() on success
   * @default false
   */
  refreshOnSuccess?: boolean
}

/**
 * Return type for the useFormAction hook
 */
interface UseFormActionReturn<TInput, TData> {
  /** Whether the action is currently executing */
  isLoading: boolean

  /** Current error message, if any */
  error: string | null

  /** Execute the action with the given input */
  execute: (input: TInput) => Promise<ActionResult<TData>>

  /** Manually set an error message */
  setError: (error: string | null) => void

  /** Clear the current error */
  clearError: () => void

  /** Reset state (clear error, stop loading) */
  reset: () => void
}

const DEFAULT_UNEXPECTED_ERROR = "An unexpected error occurred. Please try again."

/**
 * Generic hook for handling form submissions with server actions.
 *
 * Works with actions that return `ActionResult<T>` (from withAuth wrappers).
 *
 * @example
 * // Basic usage
 * const { execute, isLoading, error } = useFormAction(addExpense, {
 *   successMessage: "Expense added!",
 *   refreshOnSuccess: true,
 * })
 *
 * const onSubmit = async (data: ExpenseFormData) => {
 *   const result = await execute(data)
 *   if (result.success) {
 *     form.reset()
 *   }
 * }
 *
 * @example
 * // With callbacks
 * const { execute, isLoading } = useFormAction(updateProfile, {
 *   onSuccess: (data) => {
 *     console.log("Updated:", data)
 *     router.push("/profile")
 *   },
 *   onError: (error) => {
 *     // Custom error handling
 *     analytics.track("update_failed", { error })
 *   },
 * })
 *
 * @example
 * // Disable toasts
 * const { execute } = useFormAction(deleteItem, {
 *   successMessage: false,
 *   errorMessage: false,
 * })
 */
export function useFormAction<TInput, TData = void>(
  action: (input: TInput) => Promise<ActionResult<TData>>,
  options: UseFormActionOptions<TData> = {}
): UseFormActionReturn<TInput, TData> {
  const {
    onSuccess,
    onError,
    successMessage,
    errorMessage,
    unexpectedErrorMessage = DEFAULT_UNEXPECTED_ERROR,
    refreshOnSuccess = false,
  } = options

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const reset = useCallback(() => {
    setError(null)
    setIsLoading(false)
  }, [])

  const execute = useCallback(
    async (input: TInput): Promise<ActionResult<TData>> => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await action(input)

        if (result.success) {
          // Show success toast if configured
          if (successMessage !== false && successMessage) {
            toast.success(successMessage)
          }

          // Refresh router if configured
          if (refreshOnSuccess) {
            router.refresh()
          }

          // Call success callback
          onSuccess?.(result.data)
        } else {
          // Set error state
          setError(result.error)

          // Show error toast if not disabled
          if (errorMessage !== false) {
            toast.error(errorMessage || result.error)
          }

          // Call error callback
          onError?.(result.error)
        }

        return result
      } catch (err) {
        // Re-throw redirect errors so Next.js can handle them
        if (isRedirectError(err)) {
          throw err
        }

        // Handle unexpected errors
        const message = unexpectedErrorMessage
        setError(message)

        if (errorMessage !== false) {
          toast.error(message)
        }

        onError?.(message)

        return { success: false, error: message }
      } finally {
        setIsLoading(false)
      }
    },
    [
      action,
      successMessage,
      errorMessage,
      unexpectedErrorMessage,
      refreshOnSuccess,
      router,
      onSuccess,
      onError,
    ]
  )

  return {
    isLoading,
    error,
    execute,
    setError,
    clearError,
    reset,
  }
}

/**
 * Variant of useFormAction for actions with no input parameter.
 *
 * @example
 * const { execute, isLoading } = useFormActionNoInput(refreshData, {
 *   successMessage: "Data refreshed!",
 * })
 *
 * <Button onClick={execute} disabled={isLoading}>
 *   Refresh
 * </Button>
 */
export function useFormActionNoInput<TData = void>(
  action: () => Promise<ActionResult<TData>>,
  options: UseFormActionOptions<TData> = {}
): Omit<UseFormActionReturn<void, TData>, "execute"> & {
  execute: () => Promise<ActionResult<TData>>
} {
  const wrappedAction = useCallback(
    (_input: void) => action(),
    [action]
  )

  const result = useFormAction(wrappedAction, options)

  return {
    ...result,
    execute: () => result.execute(undefined as void),
  }
}
