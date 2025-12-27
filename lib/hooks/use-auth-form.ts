"use client"

import { useState, useCallback } from "react"
import { isRedirectError } from "next/dist/client/components/redirect"
import { signInWithOAuth } from "@/app/actions/auth"
import type { AuthResult } from "@/lib/auth/types"

interface UseAuthFormOptions {
  /** Error message for OAuth failures */
  oauthErrorMessage?: string
  /** Generic error message for unexpected errors */
  genericErrorMessage?: string
}

interface UseAuthFormReturn {
  /** Whether the form is currently submitting */
  isLoading: boolean
  /** Whether OAuth is currently loading */
  isOAuthLoading: boolean
  /** Current error message, if any */
  error: string | null
  /** Whether any loading is in progress (form or OAuth) */
  isDisabled: boolean
  /** Set error message manually (e.g., from URL params) */
  setError: (error: string | null) => void
  /** Clear the current error */
  clearError: () => void
  /** Handle Google OAuth sign-in/sign-up */
  handleGoogleAuth: () => Promise<void>
  /** Wrapper for form submission that handles loading state and errors */
  handleSubmit: <T>(
    submitFn: (data: T) => Promise<AuthResult>
  ) => (data: T) => Promise<void>
}

const DEFAULT_OPTIONS: UseAuthFormOptions = {
  oauthErrorMessage: "Failed to authenticate with Google. Please try again.",
  genericErrorMessage: "An unexpected error occurred. Please try again.",
}

/**
 * Custom hook for auth form state management.
 * Provides loading states, error handling, and OAuth functionality.
 */
export function useAuthForm(options: UseAuthFormOptions = {}): UseAuthFormReturn {
  const { oauthErrorMessage, genericErrorMessage } = {
    ...DEFAULT_OPTIONS,
    ...options,
  }

  const [isLoading, setIsLoading] = useState(false)
  const [isOAuthLoading, setIsOAuthLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isDisabled = isLoading || isOAuthLoading

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const handleGoogleAuth = useCallback(async () => {
    setIsOAuthLoading(true)
    setError(null)

    try {
      const result = await signInWithOAuth("google")

      if ("url" in result) {
        window.location.href = result.url
      } else {
        setError(result.error)
        setIsOAuthLoading(false)
      }
    } catch {
      setError(oauthErrorMessage!)
      setIsOAuthLoading(false)
    }
  }, [oauthErrorMessage])

  const handleSubmit = useCallback(
    <T,>(submitFn: (data: T) => Promise<AuthResult>) =>
      async (data: T) => {
        setIsLoading(true)
        setError(null)

        try {
          const result = await submitFn(data)

          // If we get here without redirect, check for errors
          if (!result.success && result.error) {
            setError(result.error)
          }
        } catch (err) {
          // Re-throw redirect errors so Next.js can handle them
          if (isRedirectError(err)) {
            throw err
          }
          setError(genericErrorMessage!)
        } finally {
          setIsLoading(false)
        }
      },
    [genericErrorMessage]
  )

  return {
    isLoading,
    isOAuthLoading,
    error,
    isDisabled,
    setError,
    clearError,
    handleGoogleAuth,
    handleSubmit,
  }
}

